import falcon
import json
import sys
from .actions import actions
# from .utils import handle_requests
from .db import PeeweeConnectionMiddleware
from .middlewares import CORSComponent
from .actions import load_loans, load_customers, load_transactions, get_customer, auth, get_loan, add_transaction

class Customers():
    def __init__(self, actions):
        self.actions = actions

    def on_get(self, req, resp):
        # payload = json.loads(req.stream.read(req.content_length or 0))
        customers = load_customers(req)
        resp.body = json.dumps(customers, default=str, sort_keys=True)

class Customer():
    def __init__(self, actions):
        self.actions = actions

    def on_get(self, req, resp, customer_id):
        customer = get_customer(req, customer_id = customer_id)
        resp.body = json.dumps(customer, default=str, sort_keys=True)

class Transactions():
    def __init__(self, actions):
        self.actions = actions

    def on_get(self, req, resp):
        transactions = load_transactions(req)
        resp.body = json.dumps(transactions, default=str)

    def on_post(self, req, resp):
        payload = json.loads(req.stream.read(req.content_length or 0))
        resp.body = json.dumps(add_transaction(req, **payload), default=str, sort_keys=True)

class Loans():
    def __init__(self, actions):
        self.actions = actions

    def on_get(self, req, resp):
        loans = load_loans(req)
        resp.body = json.dumps(loans, default=str, sort_keys=True)

class Loan():
    def __init__(self, actions):
        self.actions = actions

    def on_get(self, req, resp, customer_id):
        loan = get_loan(req, customer_id = customer_id)
        resp.body = json.dumps(loan, default=str, sort_keys=True)

class Auth():
    def __init__(self, actions):
        self.actions = actions

    def on_post(self, req, resp):
        payload = json.loads(req.stream.read(req.content_length or 0))
        
        # print(payload, file=sys.stderr)
        resp.body = json.dumps(auth(req, **payload), default=str, sort_keys=True)



api = application = falcon.API(
    middleware=[
        CORSComponent(),
        PeeweeConnectionMiddleware(),
    ]
)

api.add_route('/customers', Customers(actions))
api.add_route('/transactions', Transactions(actions))
api.add_route('/customers/{customer_id}', Customer(actions))
api.add_route('/loans', Loans(actions))
api.add_route('/loans/{customer_id}', Loan(actions))

api.add_route('/auth', Auth(actions))

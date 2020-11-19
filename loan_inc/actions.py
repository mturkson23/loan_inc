from .db import db, DataBaseMappings, Customer, Region, Agent, Loan, Transaction
import sys
import json
from peewee import fn

def load_customers(req, **kwargs):
    try:
        if req.params.get('search_query'):
            kwd = req.params.get('search_query')
            customers = Customer.select().where(
                (Customer.first_name ** f'%{kwd}%') |
                (Customer.surname ** f'%{kwd}%')
            )
        else:
            customers = Customer.select()
     
        data = []
        for customer in customers:
            data.append({
                'id': customer.id,
                "date_created": customer.date_created,
                "stamp": customer.stamp,
                "customer_no": customer.customer_no,
                "first_name": customer.first_name,
                "surname": customer.surname,
                "phone": customer.phone,
                "email": customer.email,
                "address": customer.address,
                "city": customer.city.name if customer.city else customer.city,
                "region": customer.region.name if customer.region else customer.region,
                "x_coordinate": customer.x_coordinate,
                "y_coordinate": customer.y_coordinate,
            })
    except Exception as e:
        return {'status': 404, 'data': repr(e)}
    return {'status': 200, 'data': data}

def load_transactions(req, **kwargs):
    try:
        if req.params.get('customer'):
            customer_id = req.params.get('customer')
        else:
            customer_id = 'NULL'

        cursor = db.execute_sql(f'SELECT * from sp_transaction_search({customer_id});')
        data = []
        for transaction in cursor.fetchall():
            data.append({
                "id": transaction[0],
                "transactionDate": transaction[1],
                "status": transaction[2],
                "customerNo": transaction[3],
                "customerPhone": transaction[4],
                "customerEmail": transaction[5],
                "customerAddress": transaction[6],
                "customerRegion": transaction[7],
                "customerCity": transaction[8],
                "customerName": transaction[9],
                "xCoords": transaction[10],
                "yCoords": transaction[11],
                "loanAmount": transaction[12],
                "paymentRate": transaction[13],
                "loanState": transaction[14],
                "datePaid": transaction[15],
                "amountPaid": transaction[16],
                "transactionState": transaction[17],
                "agentNo": transaction[18],
                "agentName": transaction[19]
            })

    except Exception as e:
        return {'status': 404, 'data': repr(e)}
    return {'status': 200, 'data': data}

def get_customer(req, **kwargs):
    """
    :kwargs: resource, id, data_def
    """
    try:
        cid = int(kwargs.get('customer_id',0))
        customer = Customer.get_by_id(cid)
        data = {
            'id': customer.id,
            "date_created": customer.date_created,
            # "status": customer.status,
            "stamp": customer.stamp,
            "customer_no": customer.customer_no,
            "first_name": customer.first_name,
            "surname": customer.surname,
            "phone": customer.phone,
            "email": customer.email,
            "address": customer.address,
            "city_id": customer.city_id,
            "region_id": customer.region_id,
            "x_coordinate": customer.x_coordinate,
            "y_coordinate": customer.y_coordinate,
        }
    except Exception as e:
        return {'status': 404, 'data':repr(e)}
    return {'status': 200, 'data': data}

def get_loan(req, **kwargs):
    """
    :kwargs:
    """
    try:
        cid = int(kwargs.get('customer_id',0))
        TN = Transaction.alias()
        repaid_subq = (TN
                .select(fn.sum(TN.amount_paid))
                .where(Loan.id == TN.loan_id))
        arrears_subq = (TN
                .select(fn.sum(TN.amount_paid))
                .where(Loan.id == TN.loan_id))
        query = (Loan
                .select(
                    Loan.id, Loan.customer_id, Loan.customer, Loan.amount, Loan.rate, 
                    Loan.begin_date, repaid_subq.alias('amount_repaid'), arrears_subq.alias('arrears')
                )).where(Loan.customer_id == cid)
        data = []
        for loan in query:
            data.append({
                'id': loan.id,
                'customer_id': loan.customer.id,
                'customer_name': f"{loan.customer.surname}, {loan.customer.first_name}" if loan.customer else loan.customer,
                'amount': loan.amount,
                'rate': loan.rate,
                'begin_date': loan.begin_date,
                'amount_repaid': loan.amount_repaid,
            })
    except Exception as e:
        return {'status': 404, 'data': {}, 'msg': "No records found", 'err': repr(e)}
    return {'status': 200, 'data': data}

def load_loans(req, **kwargs):
    try:
        loans = Loan.select()
        data = []
        for loan in loans:
            data.append({
                'customer_id': loan.customer.id,
                'customer_name': f"{loan.customer.surname}, {loan.customer.first_name}" if loan.customer else loan.customer,
                'amount': loan.amount,
                'rate': loan.rate,
                'begin_date': loan.begin_date,
            })
    except Exception as e:
        return {'status': 400, 'data': repr(e)}

    return {'status': 200, 'data': data}

def auth(req, **kwargs):
    """
    Implement authentication methods here
    :kwargs:
    """
    try:
        agent = Agent.get(Agent.phone == kwargs.get('phone',''))
        data = {
            "stamp": agent.stamp,
            "agent_no": agent.agent_no,
            "first_name": agent.first_name,
            "surname": agent.surname,
        }
    except Exception as e:
        return {'status': 400, 'data': repr(e)}
    return {'status': 200, 'data': data}

actions = {
    "load_loans": load_loans,
    "load_customers": load_customers,
    "auth": auth,
}
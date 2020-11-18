import datetime
from peewee import *
from .config import DB_NAME, DB_USER, DB_HOST, DB_PSWD
from playhouse.hybrid import hybrid_property

db = PostgresqlDatabase(DB_NAME, user=DB_USER, password=DB_PSWD, host=DB_HOST)


class BaseModel(Model):
    class Meta:
        database = db

class LoanState(BaseModel):
    name = CharField(max_length=256)
    score = FloatField(null=False)
    description = TextField()

class AgentState(BaseModel):
    name = CharField(max_length=256)
    score = FloatField(null=False)
    description = TextField()

class TransactionState(BaseModel):
    name = CharField(max_length=256)
    score = FloatField(null=False)
    description = TextField()

class City(BaseModel):
    name = CharField(max_length=256)
    description = TextField()

class Region(BaseModel):
    __table__ = 'regions'
    name = CharField(max_length=256)
    description = TextField()

class Agent(BaseModel):
    date_created = DateTimeField(default=datetime.datetime.now)
    stamp = DateTimeField(default=datetime.datetime.now)
    status = IntegerField(null=False, unique=True)
    agent_no = CharField(max_length=24, null=False, unique=True)
    first_name = CharField(max_length=256, null=False)
    surname = CharField(max_length=256, null=False)
    phone = CharField(max_length=20, null=False)
    password_hash = CharField(max_length=60, null=False)
    state = ForeignKeyField(AgentState, backref='agent_states')

class Customer(BaseModel):
    date_created = DateTimeField(default=datetime.datetime.now)
    stamp = DateTimeField(default=datetime.datetime.now)
    status = IntegerField(null=False, unique=True)
    customer_no = CharField(max_length=24, null=False, unique=True)
    first_name = CharField(max_length=256, null=False)
    surname = CharField(max_length=256, null=False)
    phone = CharField(max_length=20, null=False)
    email = CharField(max_length=60, null=False)
    address = TextField(null=True)
    city = ForeignKeyField(City, backref='cities')
    region = ForeignKeyField(Region, backref='regions')
    x_coordinate = FloatField(null=True)
    y_coordinate = FloatField(null=True)

    @hybrid_property
    def full_name(self):
        return f"{self.first_name} {self.surname}"

class Loan(BaseModel):
    date_created = DateTimeField(default=datetime.datetime.now)
    stamp = DateTimeField(default=datetime.datetime.now)
    status = IntegerField(null=False, unique=True)
    customer = ForeignKeyField(Customer, backref="customers")
    amount = FloatField(null=False)
    rate = FloatField(null=False)
    begin_date = DateTimeField(default=datetime.datetime.now)
    state = ForeignKeyField(LoanState, backref="loan_states")    

class Transaction(BaseModel):
    date_created = DateTimeField(default=datetime.datetime.now)
    stamp = DateTimeField(default=datetime.datetime.now)
    status = IntegerField(null=False, unique=True)    
    loan = ForeignKeyField(Loan, backref='loans')
    date_paid = DateTimeField(default=datetime.datetime.now)
    amount_paid = FloatField(null=False)
    state = ForeignKeyField(TransactionState, backref='transaction_states')
    agent = ForeignKeyField(Agent, backref='agents')

class PeeweeConnectionMiddleware(object):
    def process_request(self, req, resp):
        db.connect()

    def process_response(self, req, resp, resource, req_succeeded):
        if not db.is_closed():
            db.close()


DataBaseMappings = {
    'region': Region,
    'customer': Customer,
    'transaction': Transaction,
    'agent': Agent,
    'loan': Loan,
    'loan_state': LoanState,
}

if __name__ == "__main__":
    import sys

    def up():
        db.create_tables([
            Region, City, AgentState, TransactionState, LoanState, Customer, Agent, Loan, Transaction
        ])

    def down():
        db.drop_tables([
            Region, City, AgentState, TransactionState, LoanState, Customer, Agent, Loan, Transaction
        ])

    try:
        if sys.argv[1] == "+":
            up()
            print("Successfully created tables ...")
        elif sys.argv[1] == "-":
            down()
            print("Successfully dropped tables ...")
        elif sys.argv[1] == "-+":
            down()
            up()
            print("Successfully reloaded tables ...")
        else:
            print(f"Could not execute {sys.argv[1]}")
    except Exception as e:
        print(e)

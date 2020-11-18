###Setup
This web application runs on Falcon. With an ORM from Peewee. To initiate; 
- configure the database parameters in `./loan_inc/config.py`
- first run the file `scripts.sql` in the directory `./db` on your chosen postgres database
- do `pip install -r requirements.txt` to install the requirements needed for the web application to run

###Running
To start the web application run the command below
- `gunicorn --reload loan_inc.app --bind localhost:8001`
NOTE: binding to localhost:8001 is not a strict requirement. We only do this because the mobile app will be listening from this port

####Implemented endpoints
- `/customers` to fetch all users 
- `/customers/{customer_id}` to fetch user with customer id = customer_id
- `/loans` to fetch all loans given to customers
- `/loans/{customer_id}` to fetch loans given to customer with id = customer_id

- `/auth` to authenticate agent for login
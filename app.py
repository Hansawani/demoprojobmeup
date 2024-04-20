from flask import Flask, request,jsonify,render_template, redirect,session
import razorpay
from flask_sqlalchemy import SQLAlchemy
import bcrypt
import numpy as np
import pickle

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
db = SQLAlchemy(app)
app.secret_key = 'jobmeup'

client = razorpay.Client(auth=("rzp_test_Hw4sQn2Wrbsw8u", "FzZKveveEpe47blpGKe9Ssgq"))


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True)
    password = db.Column(db.String(100))

    def _init_(self,email,password,name):
        self.name = name
        self.email = email
        self.password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    
    def check_password(self,password):
        return bcrypt.checkpw(password.encode('utf-8'),self.password.encode('utf-8'))
    
    
with app.app_context():
    db.create_all()


@app.route('/signin')
def index():
    return render_template('index-login.html')

@app.route('/register',methods=['GET','POST'])
def register():
    if request.method == 'POST':
        # handle request
        name = request.form['name']
        email = request.form['email']
        password = request.form['password']

        new_user = User(name=name,email=email,password=password)
        db.session.add(new_user)
        db.session.commit()
        return redirect('/login')



    return render_template('register.html')


@app.route('/login',methods=['GET','POST'])
def login():
    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password']

        user = User.query.filter_by(email=email).first()
        
        if user and user.check_password(password):
            session['email'] = user.email
            return redirect('/dashboard')
        else:
            return render_template('login.html',error='Invalid user')

    return render_template('login.html')


@app.route("/")
def landing_page():
    return render_template('landing-page.html')


@app.route("/resume")
def resume_builder():
    return render_template('resume.html')


@app.route("/videocall")
def web_rtc():
    return render_template('webrtc.html')

@app.route("/quiz")
def quiz():
    return render_template('mainquiz.html')


@app.route('/logout')
def logout():
    session.pop('login_email',None)
    return redirect('/login')


model = pickle.load(open('model.pkl', 'rb'))

@app.route('/hi')
def home():
    return render_template('index.html')


@app.route('/predict',methods=['POST'])
def predict():
    '''
    For rendering results on HTML GUI
    '''
    int_features = [float(x) for x in request.form.values()]
    final_features = [np.array(int_features)]
    prediction = model.predict(final_features)

    output = round(prediction[0], 9)

    if output==0:
        return render_template('health_care.html')
    elif output==1:
         return render_template('Science.html')
    elif output==2:
         return render_template('Engineering.html')
    elif output==3:
         return render_template('Design.html')
    elif output==4:
         return render_template('Education.html')
    elif output==5:
         return render_template('Business.html')
    elif output==6:
         return render_template('law.html')
    elif output==7:
         return render_template('Media.html')
    else:
        return render_template('webrtc.html')



@app.route('/payment_form')
def func_name():
    return render_template('form.html')

@app.route('/pay', methods=["GET", "POST"])
def pay():
    if request.form.get("amount") != "":
        amount=request.form.get("amt")
        data = { "amount": amount, "currency": "INR", "receipt": "order_rcptid_11" }
        payment = client.order.create(data=data)
        pdata=[amount, payment["id"]]
        return render_template("payment.html", pdata=pdata)
    return redirect("/")

@app.route('/success', methods=["POST"])
def success():
    pid=request.form.get("razorpay_payment_id")
    ordid=request.form.get("razorpay_order_id")
    sign=request.form.get("razorpay_signature")
    print(f"The payment id : {pid}, order id : {ordid} and signature : {sign}")
    params={
    'razorpay_order_id': ordid,
    'razorpay_payment_id': pid,
    'razorpay_signature': sign
    }
    final=client.utility.verify_payment_signature(params)
    if final == True:
        return redirect("/", code=301)
    return "Something Went Wrong Please Try Again"

if __name__ == '__main__':
    app.run(debug=True)
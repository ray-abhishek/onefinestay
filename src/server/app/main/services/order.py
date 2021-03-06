from ..models.EntityModel import EntityModel
from ..models.BookingModel import BookingModel
from ..models.UserModel import UserModel
from ..models.OrderModel import OrderModel
from ..models import db
import jwt
from datetime import datetime, timedelta, date
from ..settings import key
from ..utils.save_data import save_changes
import json
import razorpay

client = razorpay.Client(auth = ("rzp_test_MqHwbPLOYmrkkI", "VGcpAjSN1901I9v8uTTIOx0i"))
client.set_app_details({"title" : "onefinestay", "version" : "1.0"})
#Function for adding to catalog data
def create_order(data):

    #hotel_images_json = json.dumps(data["hotel_images"])
    #features_json = json.dumps(data["features"])

    name = data["name"]
    account_email = data["account_email"]
    email = data["email"]
    message = data["message"]
    phone_number = data["phone_number"]
    order_amount = data["order_amount"]
    order_currency = data["order_currency"]
    order_receipt = data["order_receipt"]
    book_from = datetime.strptime(data["book_from"] , '%Y-%m-%d')
    #book_from = datetime.date(book_from)
    book_to = datetime.strptime(data["book_to"] , '%Y-%m-%d')
    #book_to = datetime.date(book_to)
    hotel_id = data["hotel_id"]
    notes = {'Message': message}    
    
    print(book_from,book_to," are bookfrom and bookto")

    #Check if dates overlap with a previous booking for that hotel.
    existing_booking_query = 'SELECT hotel_id from bookings WHERE checkin_dt <="%s" and checkout_dt >="%s" and hotel_id = %s;'%(book_to, book_from, hotel_id)
    data_raw = db.engine.execute(existing_booking_query)
    booking_data = []
    for row in data_raw:
        return False, {}, True
        booking_data.append(row)
    print(booking_data," is booking data")


    #Check if the email of the Auth Token belongs to a registered User. 
    user = UserModel().query.filter(UserModel.email == account_email).first()

    if not user:
        print(account_email, "  <--  LOGGED IN USER's AUTH TOKEN IS INVALID/EMPTY")
        return False, {}, False, True
    else:
        print(user.id, " is the User ID as per records")
    #using above booking ID and UserID, create an entry in OrderModel.

    order_info = client.order.create(dict(amount=order_amount, currency=order_currency, receipt=order_receipt, notes=notes, payment_capture='1'))
    print(order_info, " is order_info created by Razorpay")

    order_id = order_info["id"]
    print(order_info["id"]," is the order_id generated by Razorpay")

    #Create a record in Booking Table
    new_asset = BookingModel(hotel_id = hotel_id, checkin_dt = book_from, checkout_dt = book_to, status = "TEMPORARY")

    save_changes(new_asset)

    booking_id = new_asset.id 
    print(booking_id," is the new booking id")
    
    new_asset = OrderModel(id = order_id, user_id = user.id, booking_id = booking_id, payment_status = "NOT PAID", order_status = "TEMPORARY", description = message, currency = order_currency, receipt = order_receipt, amount = order_amount, phone_number = phone_number)


    save_changes(new_asset)

    order_id = new_asset.id 
    print(order_id," is the new order id")

    if order_id:
        return True, {"order_id" : order_id, "currency" : order_currency, "amount" : order_amount, "name" : name, "description" : "Hotel Booking", "email" : email, "contact" : phone_number}, False, False
    else:
        return False, {}, False, False




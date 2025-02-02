from fastapi import FastAPI
from pydantic import BaseModel
from pymongo import MongoClient
from fastapi.middleware.cors import CORSMiddleware

# Initialize FastAPI app
app = FastAPI()

# Allow CORS for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# MongoDB connection
client = MongoClient("mongodb+srv://malavikavinodp:malavika4@cluster0.m6f1c.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
db = client["ride_sharing"]
collection = db["rides"]

# Ride request model
class RideRequest(BaseModel):

    pickup: str
    destination: str
    date: str
# Student details model
class StudentDetails(BaseModel):
    name: str
    student_id: str
    phone_number: str
class RideRequest(BaseModel):
    student_id: str
    pickup: str
    destination: str
    date: str



@app.post("/find_match/")
async def find_match(ride: RideRequest):
    existing_rides = list(collection.find(
        {"pickup": ride.pickup, "destination": ride.destination, "date": ride.date}, 
        {"_id": 0}  # Exclude MongoDB's default _id field
    ))

    return existing_rides

@app.post("/add_ride/")
async def add_ride(ride: RideRequest):
    # Check if the student ID exists in the 'users' collection
    users_collection = db["users"]
    student = users_collection.find_one({"student_id": ride.student_id})
    
    if not student:
        return {"message": "Student ID not found"}

    # Insert the ride request with student ID into the 'rides' collection
    collection.insert_one(ride.dict())
    return {"message": "Ride added successfully"}


@app.get("/get_user/{student_id}")
async def get_user(student_id: str):
    user = collection.find_one({"student_id": student_id}, {"_id": 0})
    if user:
        return user
    else:
        return {"message": "User not found"}

@app.post("/add_student/")
async def add_student(student: StudentDetails):
    users_collection = db["users"]
    existing_user = users_collection.find_one({"student_id": student.student_id})
    
    if existing_user:
        return {"message": "Student ID already exists"}
    
    users_collection.insert_one(student.dict())
    return {"message": "Student added successfully"}



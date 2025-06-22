#  HBnB - Part 2: RESTful API with Flask

## Table of Contents

- [ Overview](#-overview)
- [ Project Structure](#-project-structure)
- [Features](#-features)
- [How to Run](#-how-to-run)
- [Testing](#-testing)
- [Technologies](#-technologies)
- [Authors](#-authors)

---

## Overview

This is the second part of the **HBnB project**, where we implement a **RESTful API** using **Python**, **Flask**, and **Flask-RESTx**.  
The API allows management of the main entities of the HBnB system: `Users`, `Places`, `Amenities`, and `Reviews`.

---

## Project Structure


![image](https://github.com/user-attachments/assets/7bb3cc5b-7369-45d2-9777-7dc40ab00289)



## Features

- **User management**: create, retrieve, update users 
- **Place management**: create, retrieve, update places, link amenities 
- **Amenity management**: create, retrieve, update amenities 
- **Review management**: create, retrieve, update, delete reviews, filter by place 

## How to Run

1. Install dependencies:
   
   pip install -r requirements.txt
   

2. Start the Flask server:
   
   python run.py
   

3. Access the interactive documentation:
   - Go to [http://localhost:5000/api/v1/](http://localhost:5000/api/v1/) to explore the API via Swagger UI 

## Testing

Unit tests should be written in the `app/tests/` folder 

## Technologies

- Python 3 
- Flask 
- Flask-RESTx
- API Documentation**: Swagger UI (integrated via Flask-RESTx)
## Authors

Nawfel | Warren | Yassine


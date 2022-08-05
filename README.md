# Gimme
Gimme is a project aims to help people who can't afford renting a delivery company to ship their simple needs over the country, it's basically ```from the people to the people``` service.

[Gimme means get me !](https://dictionary.cambridge.org/spellcheck/english/?q=fetch+me)

# Problem
Nowadays renting a delivery service costs a lot of money, just imagine you want to get a 10$ from a unoffical store which doesn't ship to your place or it's a local store, you will have to either travel to get it or rent a company to get it for you.

# Solution
Hopefully there is an alternative way, imagine you can order things from location X to Y, and someone brings it.
Gimme works as a middleware between the buyer and the courier, we gurentee the delivery process.

    - you want to buy some product from location X.
    - check for nearby courier at location X.
    - choose one based on their reviews and pricing.
    - agreement is settled.
    - product is deliverd.
    - payment is released to the courier.

# Challenges
    - Payment agreement for both sides and how to deal with failures.
    - Delivery agreement (delivery process and canceling).

# Overview
You can sign in as a Normal user (customer) or a Courier.
Users (Normal/Courier) :
    - must login to use the service.
    - must agree on the application services requirements before advancing. 
    - have their profile (name, email, phone number, SSN, payment info).
    - can view a map of couriers around a location.
    - can choose/view avialable couriers (under some restrictions).
    - can send a message to users/couriers (under some restrictions)

Authentication:

    - Login 
    - SSN Checking and Verification.
    - Phone Number.

Payment Integration:

    - COD
    - Visa,.. etc
    
# Technology

The project is divided into 2 main parts :
  - Designing (UI/UX) : Using piece of paper of using some fancy apps like figma, then the design will be converted into a nice frontend using React/Angular (React will be better option since it has faster development process and easier to maintain) with the help of some frameworks like bootstrap.
  - Backend : It will be written in JS. For the database MongoDB is great choice as it's very flexable to work with.

The intergration between the frontend and the api will be used to create a phone app later on.


# Sources

[Hitchhiker App](https://hitchhiker.io/)

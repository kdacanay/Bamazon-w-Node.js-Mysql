# Bamazon

Bamazon is an Amazon-like storefront created with MySQL and Node.js.  This appliction has 3 functions designed for customers, managers and supervisors.  The app takes orders from customers and depletes stock quantity from the store's inventory; the app also tracks product sales and inventory across all departments, as well as overhead costs and profit totals.

## Video Showing Functionality ##
[![bamazon](https://res.cloudinary.com/marcomontalbano/image/upload/v1588539504/video_to_markdown/images/google-drive--12tpkk4mhe2eFc1RyWM4qV4s4LpAqKTkw-c05b58ac6eb4c4700831b2b3070cd403.jpg)](https://drive.google.com/file/d/12tpkk4mhe2eFc1RyWM4qV4s4LpAqKTkw/view "bamazon")

## MySQL Schema ##
Created a MySQL database called ```Bamazon``` and connects to ```bamazonCustomer.js```, ```bamazonManager.js``` and ```bamazonSupervisor.js```.  Two databases are created: ```products``` and ```departments```.  The ```products``` table consists of: ITEM_ID, PRODUCT_NAME, DEPARTMENT_NAME, PRICE and STOCK_QUANTITY.  Ten fictional products are created along with their price, item id, what department they are in and amount in stock.  
<img src="images/bamazonSQL1.jpg" width=500>

<img src="images/bamazonSQL2.jpg" width=500>

## Bamazon Customer ##
* input ```node bamazonCustomer.js```
* prompts customer w/daily product list
* customer then inputs ```Item_ID``` to select product, then selects amount desired
* after checking stock, customer is either prompted that there is not enough in stock, and then is redirected, or continues with purchase
* updates SQL database with profit amount and decreases stock accordingly
* customer is then updated with total cost.
<img src="images/bamazonCustomer.PNG.jpg" width=500>

## Bamazon Manager ##
<img src="images/bamazonManager1.jpg" width=500>

<img src="images/bamazonManager2.jpg" width=500>
          
<img src="images/bamazonSupervisor.jpg" width=500>



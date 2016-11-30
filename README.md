# foodshare

https://cryptic-badlands-95460.herokuapp.com/map.html

Usage:

-Click anywhere on the map to drop a pin of where your foodShare is (or click 
"Center Map") for your current location. Add in your desired details in the left sidebar and click "Add"

-To remove a foodShare, click on the pin you would like to remove, and click "Delete" in the left sidebar.



Foodshare is a social platform with the aim of tackling food waste and hunger. The website allows users to post locations on a map coupled with information about the food they are giving away. The website will be tracking the information and displaying interesting statistics visually as new food share locations are added. It will use the arcGIS api for core functionality and will utilize a Pie Chart visualization to show food sharing hotspots. A filter will also be applied to narrow down where specific foods are being shared more.

Total Scenarios: 
1) Need to be able to Register
2) Need to be able to login
3) Need to be able to post a foodshare
4) Need to be able to filter/search through the posted foodshares
5) Need to display the foodshare data visually

Implemented Scenarios:

1)Register (Updated for React)

2)Login (Updated for React)

3)Post/read

4)delete/update

5)View visualization for food item tags







Step 1:
-------

Task: You could not finish your lunch and do not want to waste it by throwing it away so you wish to share it. You created a foodshare to give away what remained of your food. You remembered you promised a friend the rest of your food so you went back and deleted your foodshare.

1)To post a foodshare you must be logged in; create an account or login using an existing google+ or facebook account. 

2)Create the foodshare post and link it with an image of your choosing (you can pick one from google).

3)Delete your foodshare and sign out.

Step 2:
-------

1)Three of the four participants created accounts using email registration and all three attempted to login by pressing the enter key after inputting their information. However, pressing the enter key doesn't do anything in our applicaiton; you need to press the login button to login. Pressing enter to login is a standard used accross multiple sites and it would be good for us to implement it to make things easier to both understand and use.

2)Two out of the four participants had trouble finding out where to add foodshares from. The current design combines the area of adding foodshares with the list of all foodshares and they blend together making things confusing. A good way to avoid this would be to make the area which creates foodshares be seperate from the list and be a different color to stand out. It would also be better to have a title above "Create Foodshare" and having a title "List of Foodshares" above the list to remove confusion.

3)Three out of the four participants had trouble figuring out how the foodshare works. They were able to login successfully and eventually found out where to add foodshares from but spent most of their time figuring out how the foodshare works; there is a place to input information about the foodshare and then an add button. To successfully add a foodshare you need to click on the map to select a location of the share, then input information, and finally press add. The participants were not clicking on the map and were simply inputting information assuming it would select their current location. They eventually figured out what to do after looking at the help button text. Allowing users to create posts anywhere they want other than their current location would allow for easier creation of fake foodshare posts. Therefore it would make more sense to only allow users to create foodshares from their current location.

4)Three out of the four participants asked why the logout did not appear to be a button and was just text. To maintain standards held by other websites and to maintain consistency on our own website, anything thats meant to be clicked by the user should appear to be a button. The logout currently is implemented as a button but its background color is the same color around it and it has no border so it does not look like a button until you hover it. Also, only the word logout should be included in the button and not the user's name to reduce confusion because that is generally reserved for account settings.

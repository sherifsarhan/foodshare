# foodshare

https://foodshareio.herokuapp.com/

Usage:

-Click on the circular green button at the bottom of the map. Add in your desired details in the left sidebar and click "Add". It will user your current location.

You will see all the foodshares in the left sidebar. The shares at the very top are your own and are denoted with a "delete" button.

-To remove a foodShare, and click "Delete" button on your foodshare.

Foodshare is a social platform with the aim of tackling food waste and hunger. The website allows users to post locations on a map coupled with information about the food they are giving away. The website will be tracking the information and displaying interesting statistics visually as new food share locations are added. It will use the arcGIS api for core functionality and will utilize a Pie Chart visualization to show food sharing hotspots. A filter will also be applied to narrow down where specific foods are being shared more.

# Dev notes:

local envirnoment dev instructions:

-in map.html, make sure script sources point locally to 8080 (webpack-dev-server)

-run webpack-dev-server

-run npm start

-go to localhost:5000/map.html


building, pushing to repo, and deploying:

-in map.html, revert script sources

-run webpack

-Commit and Push changes

-run git push heroku gh-pages:master

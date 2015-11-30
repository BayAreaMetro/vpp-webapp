<<<<<<< HEAD
# vpp-webapp
VPP Parking Web Application [GIS]
<<<<<<< HEAD
Development Instructions/ Notes
=======
=======
#VPP Parking Web Application [GIS]
Development Instructions/ Notes
>>>>>>> development

## Requirements
####Node JS https://nodejs.org/
####Bower http://bower.io/
####Gulp http://gulpjs.com/

<<<<<<< HEAD
>>>>>>> development
##To build Environment
1. sudo npm install

2. bower install
<<<<<<< HEAD

    - Make sure to pick at least Angular 1.4 to prevent errors

3. cd to server folder and run npm start to start data service

    - Data service runs the Map and Data pages.  

    - Server runs on port 3003 when running app in localhost mode.

4. There are two ways to use data.

    - development

      - var devDataUrl = "http://localhost:3003";

    - public

      - var publicDataURL = "http://vpp-data-api.elasticbeanstalk.com";

    - public may not be the most up to date api 

5. then cd back to top level folder for app and run gulp serve

    - Browser should open at or navigate to localhost:3000

=======
  a.Make sure to pick at least Angular 1.4 to prevent errors
3. gulp serve
4. Browser should open at or navigate to localhost:3000


## Samples Research
http://bootsnipp.com/snippets/featured/toggle-navbar-with-slide-down-animation

http://bootsnipp.com/snippets/featured/simple-admin

http://bootsnipp.com/snippets/featured/pinterest-like-responsive-grid

http://bootsnipp.com/snippets/featured/tabbed-slider-carousel

http://bootsnipp.com/snippets/featured/fancy-tabs-responsive

http://bootsnipp.com/snippets/featured/full-screen-background-cover-page

http://bootsnipp.com/snippets/featured/responsive-bs-carousel-with-hero-headers

http://bootsnipp.com/snippets/featured/fancy-sidebar-navigation

http://bootsnipp.com/snippets/featured/navbar-brand-centered

http://bootsnipp.com/snippets/featured/multi-level-dropdown-menu-bs3
>>>>>>> development
=======
##Build Instructions (Local Environment)
1. sudo npm install

2. bower install
    - Make sure to pick at least Angular 1.4 to prevent errors

3. cd to server folder and run npm start to start data service
    - Data service runs the Map and Data pages.  
    - Server runs on port 3003 when running app in localhost mode.

4. There are two ways to use data.
    - development
        - var devDataUrl = "http://localhost:3003"; (See Step 3 above.)
    - public
        - var publicDataURL = "http://vpp-data-api.elasticbeanstalk.com";
        - public may not be the most up to date api 
5. Then cd back to top level folder for app and run gulp serve
    - Browser should open at or navigate to localhost:3000
  a.Make sure to pick at least Angular 1.4 to prevent errors
6. gulp serve
7. Browser should open at or navigate to localhost:3000
>>>>>>> development

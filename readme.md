method_override is user for update request

//alternate format and so important for displaying custom flash-messages
// router.post("/login", (req, res, next) => {
//     passport.authenticate("local", (err, user, info) => {
//         if (err) {
//             return next(err);
//         }
//         if (!user) {
//             req.flash("error", "Invalid username or password");
//             return res.redirect('/login');
//         }
//         req.logIn(user, err => {
//             if (err) {
//                 return next(err);
//             }
//             let redirectTo = req.session.redirectTo ? req.session.redirectTo : '/campgrounds';
//             delete req.session.redirectTo;
//             req.flash("success", "Good to see you again, " + user.username);
//             res.redirect(redirectTo);
//         });
//     })(req, res, next);
// });



<!-- <%- include('partials/header.ejs') %>

<h1>Welcome </h1>

<a href ="/campgrounds">View camps</a> -->

<!-- <%- include('partials/footer.ejs') %> -->
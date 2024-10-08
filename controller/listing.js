
const Listing = require("../models/listing");


//  index route
   module.exports.main = async (req, res) => {
    const allListings = await Listing.find({});
     res.render("main.ejs", { allListings });
};

 
// New Route
   module.exports.renderNewForm = async (req, res) => {
    res.render("new.ejs");

};

//  Show Route
    module.exports.showlisting = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate({ path: "reviews", populate: { path: "author" } }).populate("owner");

    
    if (!listing) {
        req.flash("error", "listing you are requested for does not exist!");
        res.redirect("/listings");
    }
    console.log(listing);
    console.log(req.user);
    res.render("show.ejs", { listing });
};

//Create Route
   module.exports.createListing = async (req, res, next) => {

    // let url = req.file.path;
    // let fileName = req.file.filename;
    // const newListing = new Listing(req.body.listing);
    // newListing.owner = req.user._id;
    // newListing.image = {url ,filename};
    //     await newListing.save();
    //     req.flash("success", "New listing created!");
    //    res.redirect("/listings");

    let url = req.file.path;
    let filename = req.file.filename;
  
    // listingSchema.validate(req.body);
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
   
    newListing.image = { url, filename };
  
    await newListing.save();
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
  
};












module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("edit.ejs", { listing });
};

module.exports.updateListing = async (req, res) => {
    let { id } = req.params;

    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    if (typeof req.file !== "undefined") {

        let url = req.file.path;
        let fileName = req.file.filename;
        listing.image = { url, filename };
        await listing.save();

    }


    //    res.redirect("/listings");   
    req.flash("success", "listing Updated!");
    res.redirect(`/listings/${id}`);
};

module.exports.deletelisting = async (req, res) => {
    let { id } = req.params;
    let deleteListing = await Listing.findByIdAndDelete(id);
    req.flash("success", "listing Deleted!");
    res.redirect("/listings");
};
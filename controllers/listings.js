const Listing=require("../models/listing");

module.exports.index=async(req,res)=>{
   const allListings= await Listing.find({});
   res.render("listings/index", { allListings });

};



module.exports.renderNewForm=(req,res)=>{
   
    res.render("listings/new.ejs");

};


module.exports.showListing=async (req,res)=>{
    let {id}=req.params;
   const listing=await Listing.findById(id).populate({path:"reviews",populate:{path:"author"}}).populate("owner");
   if(!listing){
        req.flash("error","Listing you requested for does not exist!");
        return res.redirect("/listings");
   }
   console.log(listing);
   res.render("listings/show",{listing});
};


module.exports.createListing=async (req,res)=>{
    // let {title,description,image,price,country,location}=req.body;
    let url=req.file.path;
    let filename=req.file.filename;
    const newListing=new Listing(req.body.listing);
    newListing.owner=req.user._id;
    newListing.image={url,filename};
    await newListing.save();
    req.flash("success","New Listing Created!");
    res.redirect("/listings");
    
};


module.exports.renderEditForm=async (req,res)=>{
    let {id}=req.params;
   const listing=await Listing.findById(id);
   if(!listing){
        req.flash("error","Listing you requested for does not exist!");
        return res.redirect("/listings");
   }

   let originalImageUrl=listing.image.url;
   originalImageUrl=originalImageUrl.replace("/upload","/upload/h_150,w_150,c_fill");
   res.render("listings/edit",{listing,originalImageUrl});
};

module.exports.updateListing=async (req, res) => {
    let { id } = req.params;
    
    // const updatedData = req.body.listing;

    // // 🛠 If 'image' is a string, convert to object format
    // if (typeof updatedData.image === "string") {
    //     updatedData.image = {
    //         url: updatedData.image,
    //         filename: "manual-entry"  // optional placeholder
    //     };
    // }

    let listing=await Listing.findByIdAndUpdate(id, {...req.body.listing});
    if(typeof req.file!='undefined'){
        let url=req.file.path;
        let filename=req.file.filename;
        listing.image={url,filename};
        await listing.save();
    }

    
    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
};


module.exports.destroyListing=async (req,res)=>{
    let {id}=req.params;
    let deletedListing=await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success","Listing Deleted!");
    res.redirect("/listings");
};
var express      = require("express"),
app              = express(),
bodyParser       = require("body-parser"),
methodOverride   = require("method-override"),
expressSanitizer = require("express-sanitizer"),
mongoose         = require("mongoose");

mongoose.connect("mongodb://localhost:27017/blog_app", {useNewUrlParser: true});
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.use(methodOverride("_method"));
app.use(expressSanitizer());//this always comes after body-parser
app.set("view engine", "ejs");

var BlogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    date: {type: Date, default: Date.now}
});

var Blog = mongoose.model("Blog", BlogSchema);

/*blog.create({
        title:"Cruso",
        image: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxMTEhUTEhMVFhUXGBUVGBgVFxcVGBgYFRcWFxUVFRUYHSggGBolHRcVITEhJSkrLi4uFx8zODMtNygtLisBCgoKDg0OGhAQGy0fHx0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLf/AABEIALcBEwMBIgACEQEDEQH/xAAbAAACAwEBAQAAAAAAAAAAAAADBAIFBgABB//EADkQAAEDAwIEBAQEBgEFAQAAAAEAAhEDBCEFMRJBUWETInGBBpGh8DKxwdEUI0JS4fFiFXKiwtIH/8QAGQEAAwEBAQAAAAAAAAAAAAAAAQIDAAQF/8QAIxEAAgICAgEEAwAAAAAAAAAAAAECEQMhEjFBBBNRYSIycf/aAAwDAQACEQMRAD8A9JldTkoVEyjBwlMY8cYwil+EAuRaYzCJj3wcTKlSJMtXr3QY5KTKcnyrAYk5vm4VOoOERzTLrMTM5QLgEFYxEVQGxGTzQ2VOS5zCvGgTlYIRh3hEpkoLCi1asDCwCLxAndHZUgAxugtqCJOT0RGukwBusYC18kyuqCczCm+hErmUHOIaBkoBI2+fRMUaZMwCVd6XooGXfJX9C1a0Q1oCm8q8DqD8mGrWz8E4UXdDst1Vtx0HyVbc2jf7QfZJ7w3tWZU02n8MhDa+AVd1bFh2kehSN3pBjyni+hTLNFgeKSE6jjGdkLxNoUnNdHC4fNe06RiIyqkz0RGN0NkCcKf8M4TGEPiPMbLBDUnSegQKtIccAyF7UaInY8oQ6Zk4EIvYEdWADhwjbdTuBMOmBzQqRJMdSmK1qRhxlC2ZpWAurgNcOHKnVdxAHZL1reCE4ynw4PNCjfwFXY17ekKlPiMd5HYVvVtpMA7oTrDhO89ksrVUFMPTMgEk/VcnqNchoENXie/oFfYGnhe0wd1HhyQilhGyxiQYM8ksamcolVpgEHK8ZT5ndGwUTpgJhr+HmlfEaJC9aQRvlYISs+BOxKkypDeI5S9QEgDcLwNE/oiA8YZkwvWtAyUQHkRAUPCG4yEAnoxkIWeaNRqBpmJUqlQu5brAF6lLbKPSpF0QCrXR9JNQzEDqR+S0tDTGsENCnLJRSMLM1b2DoMgZ6lPWdrwY3cdz+yuHWoQ/AAMrnnklLRaMIrZOi2AmqbksXIVS4hTuh6sNd14CpLm/A5r29u98rNXl4ASpuVspGNGitXcYkndFcyOYXz3U/iTwmnJ7Ac+gCzlT4tuWnjNPhaT0zCssLcbJvIkz7AHgGYB9RKadVYRIAHbZYPQfifxQN8/JaIXQOfokuUdMZxT2GugDtsqitbzt+atKrcYSjgVWOWuyUsV9CHhuPoEKiHF0bKw4yAQOaRfxtPZdKla0c9V2H4ACYyQh14I3IKlXYG8JDvVDfU80u/CmAe+KAzzA+qDWusSmLqo04Awk7prHRwnYZRsCR1B7gOJMW9yXeqSpsLhE7IzagaIGD1Q/owbiAwuSbqhJXJbDRaU3fNTFQ56rmloAjfmo0z5imFOY7OThTrVGkw1DuaEZQalMtgj1RBsk9hache0mwiVqhMEqAOcIBDBvQ7LxrZEzlRoNOZUXmO6xhm7o8LRkE7oNNpiQhuPdMvbABn2RNRC4PFGITOn2JLwJlJ1Gd91eaDQ4fMfZJOVRDCNs1FowAADYJl5VW+9Awo/9TbtK43NHSosdqVI3QHPSFW8C6hWlT52ynHQzUcUpWpk7JlxUKtQASSAmas10VF7aPjCy2q29QZ4e+B0WxqanSGC4ffZB/jaDt3Aev+UFhl2g+7Hpnyq80yq6s14IxtIJztMdQnP+hvrQKhLo6YmOq+mjRaVQB7OE9CD+yHU0mNsq/u5IqiXt45Oyj0HRuAZaGgbIt/bFp4mbdP2VvRt46r24AO26g23tlVrSKqz1AEQVKs9u8oGo6aR/MZ+E7j+09fRVznmIP2EEEtKxxI+aUNcObB5KNhWxBhe1qcLqwStHNmjTByJyCol8nhwpvyInPJQbQEzzXQiLRzbV+TIIHJL0GkknYJtoI3+iUcwucRs1KlYXonTokDOFCu4A4yieLyJJASQGTCLeqAuwhr9lyHBXLG0X3gklDe6CpuaTOYXMY2M5KZCsLu1DqO4mx0XcHfC8pDcclgkJgITB03RWxBBUXPDR3QMTDCdyvHS0bSvaTvLlRfUxCJj1jQU3SiRAlIAwUWeey1fIL+A9RpL4x7K6a/hgdFU6YzzyfVWTRJXH6iW0jqwR1YrqeoAeqqGX5aZJRfiTVqdMEOIEYJMbrC1PiGmT5XY7qSwyZV5Io+hs1IEK9010tBXzjR6xcWmfKYg9uy+i2I4WT2SKD5UO5LjZLUdRFMdScAfsqC7u31DLzA6D9Sg17wOeXuP/AG+n7lVd5fjr9/cLvx4ktnHKdlh/FNbMYHoqK8+JGh3DI++6RuNQdMffy+axmpyahJM5PsJ2Vrol2fS7fVnsPiUHcJ3OZDuzhsVsND+JadwA1x4KuxbyJHNq+K2GtljY5K2+HLxziXnywZHWY6/RBxU9G5cdo+1VKU7JGpTg9ktoeqcbAS6TERMqxrZyN1x5IU6OnHOxemQMcuc5VLrdhw+dn4fy/wAK+Y4bEQfovKjQZadjjspJFLpmRs2jf7901UewAiEF9E0qpYRg89/Re1mgNLj9FfA6J590BtQC3JgryqTEgyiFktBB3S+w7roIDBe5wEQvHM4RD+fRIulpjMnKNXfgblEDdjFUswaY9QlqrgDgZO4QqNeB7pumDxF4jbml8gKlzzOy5XJoDqPouTVI2gpfiVKnSMSi0bfiGDhetcG4RMCa/OdlzHySAVBrgXCdpRLmADwbLGFnicAorbeIKEAQJTHjOESsAhWqHZCpnkUWo+clS8PmhYQfAZ2TppcRDSIK6zaZy30WitmgQSBP5JZTUUGMW2VtOwNJvE7d3LoAoOqx5lY6y/yg9/0VBf1PLC4MkrlZ241So+X/ABtdGpcwfwjPzOU1a0XXBDAxraAiBwiSRGZV5R+G/FcXubJ5Ty6Qrq10rw4GJ7ctsLo97jCkSeLlO2R+HdM4eERgFaX4iq8FsY5kN+e/0leafQ4Ur8ZP4rSoBu3hcPZwn6Sp4VcrY2Z6pHzz4g1RzRAWZZrVQYJ8p6YVvf1mOid1nKrZcWjqu5nIXAvdnZ7jqFB1syqZGPv6peq0Nx7FBbg/UI/0UfpaYwHJ9ld2rmmnws4W8G0885Wep1zzTNvVM4nrjmmtI1M3Wj3ZaBmD97Ba6yuQWjOfvZfPdKuAd/pn6clqtLeJ/wBzHoufIrLRdGlc2crmidhnpKhRuJUKtbhdPLmudxoqpFZrVI7xkdd4VH4sgham4rNqNI3ImFj7d443N2M/cLL8ZJh/aLQzTk7bhe+Fwul2ZXlIQYyuq0STPF7Lr+zmbrR11TA/mTPZLVahMD5Jy2oQPM3fmVW1bdxcS07HCyA2GpMP9Q+QU3gAHKbc91NrQB+LeVX1KHm3xzRfwBfIIPcuRXUiDEFchcg1EtrVjyyWjHZGqUSGgkR6odrUqU9hgdUepXfcA7NhMbQiKvm23wi/w5iOKB0XrLePxKVxeMiAMjmsAHckCAMoT6205UBVLiV65/ZZsyCU2hxMqYecpN1YclKm8zMpQl3bXJMTyT4rwqiiYEDdF8XquXLPdHVihqxq6uZaQVn76pg+iefVl0KrujuCuZl0iz0at5RPPZWBaJlVuiu46I6tJHyTNRxEFMgMtGGELVrbiovA3cDH+1CjXwPdM1nSwDfEwrYnTsjlVo+O6jpBOMjOeh9PqkmUKdIxuYGeecr6BrtkDJB4YGT988fRYvV7Uzkc559sfRdya7RyUyoqsk7rxjCRjlkfsiOt5dAEb/mT8+XspPYBtk9h35fVCzUdRdxcu3JO06fCeWD95/VJ2jTxRAgmRIxOcQrHgycYOeozzDuXT69VmwoftHt5YPSfv8lf6bWI3nHX/wChss9bU28IgHvOCO2B9Z6q4sa5AxnsVNoZM1dpd7R9P3TlarIWctbqBIPPZOXV+AwnoCpyRRC+mXRbVLZlp+Y7rtSteGtxjYjKofhO6L61QGYGR7laTUroNc2Y2Upa7KR30LUo3RrZhJJISjr2mPwgieW49l1TUC/8OBCvHLAlLDMaq1XudA/DylJVXFpInO8ojQ54gOiEJtCWlxOQU3Jt2TqtMMLniEPnpKA8CSOXUqdS2eCHD1yvH1C8mYCbbM6BPq5/EVyWe3JXIWjUzQOq8nzCVc/hceCQCiNlxk8kKunYpMXLueQo1M7L2m2eyHthCw0RqP7eqG6opvZyQqkAIGOa3izCJSaZgZXnidNlOk+DhYw/buIMFGcRKrmViDJ2TArTnkuXNHdnVhlqhd1b+aOiW1B+SmazMyqe6r+Yhc9ao6fsv/g6sDxs6ZVxcjJ+izXw4fDr9ntPzC1Ncy76oronL9hWozh4R3/NGLsdIXtSmXS75ILmyjEWQveUmuyeX39+yy2tU2yMY6+i1tchoVFf0gRBzv8AquuD0c0kZO8pxkjMD65KQFDIA7HI79fktBfWpM9435dP0S1Gjws43GMEn3iPXkqJilffVBTAP9fQ7dwRyI5H/KRt9fe0QWt26cpB/c+6T1S48R5JkEYEnlyH+UgFjF/R+ISHEuaCMT6gAE/SVZW2stdvg9uZHP3wsq2mrO0oxg9igPGNmpq3BpAOcYDtuh7qsudcdVcKbOvzHP8AdOWdA1qTqDvwkSP+Lhs5vv8ANZNjjTqwcFri13sYKEYpu2NkUoI3PweB4ryPwhuPcycqy1TLp+Sz3wu7hqBoP4mkGJxzErdW1AR5gFD1C/Ipg6soqdAHYZTLLZP1rVsyFEtIXMtO0dD2qA07Fm/FmEGlSOZKLUpCeMb80HxiOW69CLi1aPPkmm0yT6jsSUB9uI4iczheMyRJRru6BaGgQRzT6YnQPw29VyCxwhctaDTLJlYgbKDHTyWpo6I0gcSdt9Cpt5IckamY1lo6JgprT9PL3wQtuLBsRClbWLQZhG0DZgtT09wqBjRuYQtf0402MYBLjuV9JZYNLuIjIQK+nNe+XCeiwNnzW5tuFjRwmeqQovcDzK+o32ktdyWYvdH4HdiU1WBMz7mHmE4ymA0deiLcgNdxATHVSbVBMuESknC0ykJUxcNkGVQarSOY5LR1RBVReieL2P7rga2d6kC026Ja1w/Ewz+4W1o1QeHuAsDZMNN7h/SVp7G6kADcfoiLIvajoH5JLxeGQvLmvsQcJWlcguM+iZKiTZGvnPX7H5KrvARPt8xCta7JyDj8lU3uGxv+fqqxYjK+rWzB5ECfSDH5LO6xdkM8Mcxy6cgVY3NaTv79Vnrxxc48/wDaqmBRK/w5iUWpZxnpujtpwZO6f/h8Tk+0IjqAnbUwdhPVO2lEkduXfuutaEbxCdo4wMIFYRZZ6PaumC49cKi+MLaLqNuJrHT1JkT/AOK2ui238snhzyJ59crQf/omkNqabQuA3z24Zkb+G+GvHsS13seqaK8g9TJJKJ88+HiTXYSe2Tvg+y3T6o6rEaGyLhg9foCtjUpzkLn9Q/yEw9BYXkLqDCQjC3K5+PktyE61OFV+LnrCvXUnDuFT6hR4XS0CYyrYW42iOZXsgx4IJOOiFUbxZ6Je3HFI2TNo2JEzK6U30c1Hjap/sXKL6b5wV4msJ9UY4IjXQqu2vGnYp5lQFcjOjQya68bWQUGo+Ejk0FRTLFlzC9NwFSOuSpCvKKyszxFy2uCUGtbteZKqHXRCNT1Duqxz0TeCz260em+cKnutKDXATMK+dqQ4SG7qmrVJOVsufVI2LB+VsqNXoGJbyWZfW8xn0W9Y2R6rG6/o7mv4mAkb4XMpHS0QpQ4Ht+im15pkOHJT0bTnsp/zBBOYXtwJBCNhSstqVUPZIyN/SVR3k03OdyOU9p9MtGM9l1cTuE6ZJxplC74jxIBInIHLv7/v0VfefFLSDAJxPryKtali1rvEpQ1/MEeVw5gjl6heP0mhcNcOEUak5GIJ/uB7yunHGMunshOUo+DGt1A1KjWnAJgdwdvfZWzrMiBGdpVVqOlNpPcw1G+U95HRXuh6xTqkU6mHiACY8/vyPZM40UwZE9MgywDcuElGFoTkrT6PoRuqvhtcxhDS4cUw4ggcIj1n2U73RK1FxFVnD0du09w7ZCmdUeF8b2ZllpE7Y5fsmLKyLjjqrqhpJOdvXAhWdvYtYeKfaMH17IqNmk1Holp9KKfhvkMdv+3ZbDUw19jVYIINJ4gZ/pMfoqbTLA1ScgNGTP0CLrGo0m02+GY4ZBA3PWR1lMkQyxU2vnz9HyrSaxZccODvH+Pqt9aN4hlYnUHNFY1AIM8vWY9VqNPuTEFc+dVKxce00i4ZSjYI/CCkqV1OHYPIpyJCmgti9RkKtvGSeUq2ouJkOVD8TUnMgtkopbA3orKbGF/C88A6hEr3NNhLGGf+W6Qa4tdL2E/VEY4DzNaAf7V0rs5n0eOus7rxNDTWu8xABOVyagbLGwuuE4yFpbK+AGSsg9hbsFJrKhgTBKRxHTPodOuDzQ6rwsFSuazXcIfsrOy1dxdwuOym8djqdF69soluwLyhWaQmWsnZQcKLKdi2pFoGFTMqyeEK21G2xuqqzZ5j2Up9loVQ8zAQHuU3OQHOQCOUnQF1NvXmlXVl4L4CFkKyOruzHQLM3NwOKN4yUfWtQc4mFSUgc90btjJVE1Fi+RtCPVogpSydwsA5lO0nkqlk2ivuLMHdVl5pnECCSR6x9Qry5KqriqdhsjYtGU1HRnA/34GTuY2nrhVz6EbiD3H30W5svPM7DqlrjT2vmRtzVo5n5JPEvBn7DU6tGH0qjmuaQQdwIPQ8l9p+FPjKle0wHw2qB5m/+zJ3b+S+PXujlswcFpMJPR6r2VBE9iDBHp0V4ytaJyj1Z9vubHxHuLHNgYyRPySVdtvTFNznlw4odERseW4ysNb/ABG+ZD4J3mcqsv8AWSCZeTI2ZjJ3lx29kyRf3KVWbzXPiZgHBRaRwnHDvBEZPT16LI3N86SXkTmANhykk84WfbrDhMENbzgCf1UaLzVIDSQNzuSe/Tqm0iEsjql0O2jHVKgMSJ6d+61dI+b5fTmltN0wU2zzKc8FcmaXLRbCq2WNPIgpy1fyVVQqOanqVSVBOiso2MCpBKjqNMOpz0yvXUQczlcWENIO0JyTMhqVxJEJDjdy3T9ekASWgnKiQDAjK63vZzVWgAuXLkV1J0rlqDZbUGyPRSYSXAuPlmMITacHdF4QdhtunoUBdNaKp4ZiEk2Q8wrZxGCQlLkieJqBiw0K44T5yrlmvsDuELH8TiZ2UnPMyN0jjYylRsbnUmPGEO1ZDfVZKm90zPstZQd5R6LjzQ4uzrxTtUBuHQUrUqJi5SNZQLon4i9piWEyPeSkqrsJ7SwC0tKyAymvWT3/ACSooRv2VvcUvMUreNgfNavIb8HMqwC48lYUJ4c47JC1ZPDO0z+yfc+TCcUFdO5BJGn5SUdz5JXtcQ2U1C2VlDypmdui8NPb73ULkQQOi3QEFcA4HqqO60uCY8s7d/2VjRrwY7hWlRoLwInH5BUjJp2hZRT0zEVdPeAZ4pncbDce+4+SgzRKjhmZ325Y/wA/RbRtAcUe6PStxKr7xJ4TJUPhhwAP9Uz0iIx991oLDR204e3/AF97qz4QJ7I1RwEdHCPdZ5W1oyxpMgB1Uywj/CWBLXRyj7KfolSstQCnUB+/0RsclGtQB5IBpuGxPuleg9j9KqnmuBacclTUgVZWh6potk5ozNev4ZcI5lL1XFwDtoymddZ/MISlJ+InHNdak2jm4pDkk5x9FyUFaNgYXiICxZyPVFY6AQVy5MAXqeYcI5JMCPLyXLkDE6piAiPaIxvzXi5EB4wxC09q6WArly5fU/qdGD9jx7ZSdalhcuXEdgi4ItnV4Xg+y5cgjMbvaOZVXqLMAr1cqPyJF9HlnuB0EqbqkBxPdcuRQzErElxk7D9dk9dCWx1XLk3kTwCcz8KHqQwHLlyzAioafNPurSjV4qg9F6uWiFhg+KoHZFrVIz2K5cmACbcSSOrZRKNXjZwn7IXLkwqBscTg7hMULrhMELlyUccbXaV7UC5cimLJEeKOUpi2qEnovFybyI+in1ijNceyr7ykGl3RcuXVBaOaT2CbXMLly5NQLP/Z",
        body: "It's Dog On the Blog App"
    }, function(err, crtBlog){
    if(err){
        console.log(err);
    } else{
        console.log(crtBlog);
    }
});*/

//RESTful ROUTES...
app.get("/", function(req, res){
    res.redirect("/blogs");
});

//INDEX ROUTE
app.get("/blogs", function(req, res){
    Blog.find({}, function(err, retBlogs){
        if(err){
            console.log(err);
        } else{
            res.render("index", {blogs: retBlogs});
        }
    });
});

//NEW ROUTE
app.get("/blogs/new", function(req, res){
    res.render("new");
});

//CREATE ROUTES
app.post("/blogs", function(req, res){
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.create(req.body.blog, function(err, crtBlog){
        if(err){
            res.render("new");
        } else{
            res.redirect("/blogs");
        }
    });
});

//SHOW
app.get("/blogs/:id", function(req, res){
    Blog.findById(req.params.id, function(err, fdBlog){
       if(err){
           res.redirect("/blogs");
       } else{
           res.render("show", {blog: fdBlog});
       }
    });
});

//EDIT
app.get("/blogs/:id/edit", function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            res.redirect("/blogs");
        } else{
            res.render("edit", {blog: foundBlog});
        }
    });
});

//UPDATE
app.put("/blogs/:id", function(req, res){
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err){
        if(err){
            res.redirect("/blogs");
        } else{
            res.redirect("/blogs/"+req.params.id);
        }
    });
});

//DESTROY
app.delete("/blogs/:id", function(req, res){
    Blog.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/blogs");
        } else{
            res.redirect("/blogs");
        }
    });
});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Our Blog Server is Running....");
});
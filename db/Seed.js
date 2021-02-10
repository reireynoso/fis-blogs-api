const User = require("../models/User");
const Blog = require("../models/Blog");
const Cohort = require("../models/Cohort");
const cheerio = require('cheerio');
const axios = require('axios');

const tags = [
    "JavaScript",
    "Ruby",
    "Ruby on Rails",
    "HTML",
    "CSS",
    "SASS",
    "NodeJS",
    "React",
    "MongoDB",
    "SQL",
    "NoSQL",
    "MySQL",
    "Active Record",
    "PostgreSQL",
    "Mongoose",
    "REST API",
    "Java",
    "C++",
    "Python",
    "Django",
    "Semantic UI",
    "Material UI",
    "Materialize CSS",
    "Tailwind CSS",
    "Express JS",
    "Frontend Development",
    "Backend Development",
    "Teaching",
    "Guide",
    "Problem Solving",
    "Stress Management",
    "Time Management",
    "Deployment",
    "Software Development",
    "Web Development",
    "Planning",
    "Angular",
    "JQuery",
    "VueJS",
    "DenoJS",
    "Rust",
    "Redux",
    "Github",
    "Algorithms",
    "Data Structure",
    "Testing",
    "Cryptography",
    "Command Line Interface",
    "Bootstrap",
    "Tech Ethics"
]

const links = [
    "https://medium.com/@reireynoso/tty-prompt-select-for-handling-user-inputs-aed13f46c8bc",
    "https://medium.com/@reireynoso/flexbox-a-layout-solution-41df47441750",
    "https://medium.com/@reireynoso/utilizing-global-variables-in-dom-manipulation-c1239a8584f0",
    "https://medium.com/@reireynoso/drag-ndrop-with-react-beautiful-dnd-73014e5937f2",
    "https://levelup.gitconnected.com/guidelines-for-a-new-coding-project-7ec063bace78",
    "https://levelup.gitconnected.com/simple-authentication-guide-with-ruby-on-rails-16a6255f0be8",
    "https://levelup.gitconnected.com/javascript-basics-and-fundamentals-ccb1f017d6f3",
    "https://levelup.gitconnected.com/creating-a-basic-rails-crud-app-8720a53f0158",
    "https://medium.com/better-programming/javascript-event-listeners-closure-vs-delegation-e17552f1f59f",
    "https://levelup.gitconnected.com/building-a-small-rails-api-with-serializers-32e3e69a078",
    "https://medium.com/better-programming/redux-setup-for-your-react-app-d003ec03aedf",
    "https://levelup.gitconnected.com/jwt-auth-in-a-react-rails-app-8a7e6ba1ac0",
    "https://medium.com/@chlorox416/practice-practice-practice-and-more-practice-56cdb3b0bc8e",
    "https://maryclaired.medium.com/reacts-state-hook-206a6f9b0cfc?source=friends_link&sk=60c3d3b488b7905cfb8bb6ab8288215d",
    "https://agbeyegbesisan.medium.com/a-crash-course-intro-to-react-357e6d3eb440?sk=b47da858d05621a5661c9037f84033fc",
    "https://lojacqueline2.medium.com/react-modals-132344b60624",
    "https://medium.com/@dong_xia/creating-a-card-flip-i-challenge-you-to-a-duel-4e4e124c5060?source=friends_link&sk=43aca62c4b0917a790f39cebde53437b",
    "https://medium.com/@zar.catherine/javascript-arrow-functions-vs-regular-functions-5ec4a9076796?sk=f0b16a45403527b58b41a544f18385c3",
    "https://medium.com/@emjose/an-e-manual-by-emmanuel-part-1-55bded835b14?source=friends_link&sk=57c66159b4fc30dc3b035493cd571944",
    "https://medium.com/@fbado66/getting-started-with-materialize-css-cfe1eca17b2f?source=friends_link&sk=49e225b68b8015a217f8e64fc492f22f",
    "https://medium.com/@david.felix02/most-popular-programming-scripting-and-markup-languages-d829240c991c?source=friends_link&sk=5c69e3359c488cd7aa2ea2eaa90795f2",
    "https://medium.com/@hortenciaecisneros/how-i-visualize-every-project-before-writing-code-74ff7aa96b2d",
    "https://medium.com/@nimaevasb/class-components-and-functional-components-in-react-253798fb6cb4?source=friends_link&sk=f4d95ec010554de1070ca2268f30e496",
    "https://cappie100.medium.com/careers-you-can-have-as-software-engineer-bootcamp-graduate-part-two-27eeedaa1653?source=friends_link&sk=d587e85cae754d428bc22f6fafff13eb",
    "https://medium.com/@waverley_nyc/how-to-set-up-your-project-rails-api-and-javascript-40b79fc9b978?source=friends_link&sk=435e62bc9c1ff8fea594b22fc3d6fabb",
    "https://medium.com/swlh/fetch-requests-and-controller-actions-connecting-the-frontend-to-the-backend-733a87ffe757?source=friends_link&sk=624ba3d4ec76605f44688dbbded691c9",
    "https://medium.com/dev-genius/building-shopping-cart-for-the-user-9f58e13aa3e3?source=friends_link&sk=81973ba86f6928120a8cd6a4c9e613a5",
    "https://medium.com/@morningchenyun/how-i-build-a-single-page-application-with-ruby-api-backend-and-js-frontend-from-scratch-38bb73ec5223?source=friends_link&sk=0144ef3f6597482504bf39d07a650826",
    "https://medium.com/swlh/asynchronous-javascript-as-an-art-masterpiece-1c7a9123ce8e?source=friends_link&sk=20114c065dd4093efa1c9c5539f32cfd",
    "https://medium.com/@wilsonvetdev/secrets-of-smart-devices-pt-3-3b68b55ee9ec?source=friends_link&sk=30ab29d1f4ea15a1fafcf3d9dacc0961",
]

const data = async() => {
    User.collection.deleteMany({})
    Blog.collection.deleteMany({})
    Cohort.collection.deleteMany({})
    
    // const users = await User.insertMany([
    //     {
    //         admin: true,
    //         githubId: "34077185",
    //         name:"Reinald Reynoso",
    //         email:null,
    //         image_url:"https://avatars3.githubusercontent.com/u/34077185?v=4",
    //         lastUpdated:"2021-01-04T21:53:24Z"
    //     },
    //     {
    //         admin: true,
    //         githubId: "29000122",
    //         name:"Another Admin",
    //         email:null,
    //         image_url:"https://avatars3.githubusercontent.com/u/29000122?v=4",
    //         lastUpdated:"2021-01-04T21:53:24Z"
    //     },
    //     {
    //         admin: false,
    //         githubId: "24644341",
    //         name:"Some Student",
    //         email:null,
    //         image_url:"https://avatars3.githubusercontent.com/u/24644341?v=4",
    //         lastUpdated:"2021-01-04T21:53:24Z"
    //     },
    //     {
    //         admin: false,
    //         githubId: "52926639",
    //         name:"Another Student",
    //         email:null,
    //         image_url:"https://avatars3.githubusercontent.com/u/52926639?v=4",
    //         lastUpdated:"2021-01-04T21:53:24Z"
    //     },
    // ])

    // const cohorts = await Cohort.insertMany([
    //     {
    //         name: "DUMBO-040119",
    //         admins: [users[0]]
    //     },
    //     {
    //         name: "DUMBO-082619",
    //         admins: [users[0]]
    //     },{
    //         name: "DUMBO-111819",
    //         admins: [users[0]]
    //     },
    //     {
    //         name: "DUMBO-042020",
    //         admins: [users[1]]
    //     }
    // ])

    // const blogs = await Blog.insertMany([
    //     {
    //         title: "Building a simple REST API with NodeJS and Express.",
    //         link: "https://medium.com/@onejohi/building-a-simple-rest-api-with-nodejs-and-express-da6273ed7ca9",
    //         user: users[2],
    //         tags: {
    //             "JavaScript": "JavaScript"
    //         },
    //         cohort: cohorts[0],
    //         image: "https://miro.medium.com/max/1400/1*uPL1uCtLBRSk6akPL2hNzg.jpeg",
    //         approved: false
    //     },
    //     {
    //         title: "TTY-Prompt Select for handling User Inputs",
    //         link: "https://medium.com/@reireynoso/tty-prompt-select-for-handling-user-inputs-aed13f46c8bc",
    //         user: users[2],
    //         tags: {
    //             "Ruby": "Ruby"
    //         },
    //         cohort: cohorts[1],
    //         image: "https://miro.medium.com/max/1400/1*uPL1uCtLBRSk6akPL2hNzg.jpeg",
    //         approved: false
    //     },
    // ])

    // links.forEach(async(link) => {
    //     const {data} = await axios.get(link);
    //     const $ = cheerio.load(data);
    //     const title = $('meta[property="og:title"]').attr('content')
 
    //     let image = $('img[alt="Image for post"]').attr('src')
    //     if(image){
    //         image = image.replace("60", "728");
    //     }

    //     const tagsObj = {}
    //     for(let i = 0; i < 3; i++){
    //         const random = Math.floor(Math.random() * tags.length); 
    //         if(!tagsObj[tags[random]]){
    //             tagsObj[tags[random]] = tags[random]
    //         }
    //     }
    //     // create the blog object
    //     const randomUser = Math.floor(Math.random() * users.length);
    //     const randomCohort = Math.floor(Math.random() * cohorts.length)
    //     const blogObj = {
    //         title,
    //         link,
    //         tags: tagsObj,
    //         user: users[randomUser],
    //         image,
    //         cohort: cohorts[randomCohort]
    //     }

    //     const blog = new Blog(blogObj);
    //     await blog.save();
    // })

    console.log('seed');
}

module.exports = data
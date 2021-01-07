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
]

const data = async() => {
    User.collection.deleteMany({})
    Blog.collection.deleteMany({})
    Cohort.collection.deleteMany({})
    
    const users = await User.insertMany([
        {
            admin: true,
            githubId: "34077185",
            name:"Reinald Reynoso",
            email:null,
            image_url:"https://avatars3.githubusercontent.com/u/34077185?v=4",
            lastUpdated:"2021-01-04T21:53:24Z"
        },
        {
            admin: true,
            githubId: "29000122",
            name:"Another Admin",
            email:null,
            image_url:"https://avatars3.githubusercontent.com/u/29000122?v=4",
            lastUpdated:"2021-01-04T21:53:24Z"
        },
        {
            admin: false,
            githubId: "24644341",
            name:"Some Student",
            email:null,
            image_url:"https://avatars3.githubusercontent.com/u/24644341?v=4",
            lastUpdated:"2021-01-04T21:53:24Z"
        },
        {
            admin: false,
            githubId: "52926639",
            name:"Another Student",
            email:null,
            image_url:"https://avatars3.githubusercontent.com/u/52926639?v=4",
            lastUpdated:"2021-01-04T21:53:24Z"
        },
    ])

    const cohorts = await Cohort.insertMany([
        {
            name: "DUMBO-040119",
            admins: [users[0]]
        },
        {
            name: "DUMBO-082619",
            admins: [users[0]]
        },{
            name: "DUMBO-111819",
            admins: [users[0]]
        },
        {
            name: "DUMBO-042020",
            admins: [users[1]]
        }
    ])

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

    links.forEach(async(link) => {
        const {data} = await axios.get(link);
        const $ = cheerio.load(data);
        const title = $('meta[property="og:title"]').attr('content')
 
        let image = $('img[alt="Image for post"]').attr('src')
        if(image){
            image = image.replace("60", "728");
        }

        const tagsObj = {}
        for(let i = 0; i < 3; i++){
            const random = Math.floor(Math.random() * tags.length); 
            if(!tagsObj[tags[random]]){
                tagsObj[tags[random]] = tags[random]
            }
        }
        // create the blog object
        const randomUser = Math.floor(Math.random() * users.length);
        const randomCohort = Math.floor(Math.random() * cohorts.length)
        const blogObj = {
            title,
            link,
            tags: tagsObj,
            user: users[randomUser],
            image,
            cohort: cohorts[randomCohort]
        }

        const blog = new Blog(blogObj);
        await blog.save();
    })

    console.log('seed');
}

module.exports = data
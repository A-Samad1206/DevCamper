import bcrypt from "bcryptjs"
const users=[
  {
    name:'Admin User',
    email:'admin@gmail.com',
    password:bcrypt.hashSync('123456',10),
    isAdmin:true
  },
  {
    name:'John Joe',
    email:'john@gmail.com',
    password:bcrypt.hashSync('123456',10),
  },
  {
    name:'Proshop',
    email:'proshop@gmail.com',
    password:bcrypt.hashSync('123456',10),
  },
]
export default users;
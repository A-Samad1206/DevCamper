export const notFound=(req,res,next)=>{
  const error=new Error(`Not Found - ${req.originalUrl}`)
  res.status(400)
  next(error)
}

export const errorHandler=(err,req,res,next)=>{
  /* stm error gnerated get 200 HTTP code,despite being an error
     So down below fix this problem.
  */
  const statusCode=res.statusCode ===200 ? 500: res.statusCode
  res.status(statusCode)
  res.json({
    message:err.message,
    stack:process.env.NODE_ENV==='production'?null:err.stack,
  })
}
const express = require("express")
const app = express()
const { getTopics, getEndpoints, getArticleById, getArticles, getCommentsByArticleId, postCommentByArticleId } = require("./controllers/app.controllers.js")
const { handleCustomErrors, handlePSQLError, handle404Error, handle500Errors } = require("./errors/index.js")
app.use(express.json())

app.get("/api/topics", getTopics)

app.get("/api", getEndpoints)

app.get("/api/articles/:article_id", getArticleById)

app.get("/api/articles", getArticles)

app.get("/api/articles/:article_id/comments", getCommentsByArticleId)

app.post(`/api/articles/:article_id/comments`, postCommentByArticleId)

app.use(handlePSQLError)

app.use(handleCustomErrors)

app.use(handle500Errors)

module.exports = { app }
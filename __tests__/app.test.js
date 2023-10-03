const { app } = require("../app.js")
const request = require("supertest")
const testData = require("../db/data/test-data")
const seed = require("../db/seeds/seed.js")
const database = require("../db/connection.js")


beforeEach(() => {
    return seed(testData)
})

afterAll(() => {
    database.end()
})


describe("404 Upon Bad Path", () => {
    it("should respond with 404 upon bad path", () => {
        return request(app)
        .get('/invalidpath')
        .expect(404)
    })
})

describe("GET api/topics", () => {
    it("should send 200 status upon a valid request and respond with all topics data", () => {
        return request(app)
        .get('/api/topics')
        .expect(200)
        .then(({ body }) => {
            expect(body.topics.length).toBe(3)
            body.topics.forEach((elem) => {
                expect(elem.hasOwnProperty('slug')).toBe(true)
                expect(elem.hasOwnProperty('description')).toBe(true)
            })
        })
    })
})

const endpointDocs = require("../endpoints.json")
describe("GET /api" , () => {
    it("should respond with 200 and object containing info about all endpoints", () => {
        return request(app)
        .get("/api")
        .expect(200)
        .then(({ body }) => {
            let parsedEndpoints = JSON.parse(body.endpoints)
            const responseKeys = Object.keys(parsedEndpoints)
            expect(responseKeys.length).toBe(Object.keys(endpointDocs).length)
            responseKeys.forEach((key) => {
                expect(parsedEndpoints[key].hasOwnProperty("description")).toBe(true)
                expect(parsedEndpoints[key].hasOwnProperty("queries")).toBe(true)
                expect(parsedEndpoints[key].hasOwnProperty("exampleResponse")).toBe(true)
            })
        })
    })
})

describe("GET /api/articles/:article_id", () => {
    it("should respond with 200 and the correct article object", () => {
        const articleId = 3
        return request(app)
        .get(`/api/articles/${articleId}`)
        .expect(200)
        .then(({ body }) => {
            expect(body.article).toEqual(expect.objectContaining({
                author: expect.any(String),
                title: expect.any(String),
                article_id: 3,
                body: expect.any(String),
                topic: expect.any(String),
                created_at: expect.any(String),
                votes: expect.any(Number),
                article_img_url: expect.any(String),
            }))
        })
    })

    it("should respond with 400 and bad query if article_id is NaN", () => {
        return request(app)
        .get('/api/articles/notanumber')
        .expect(400)
        .then(({ body }) => {
            expect(body.msg).toBe("invalid input for article_id")
        })
    })

    it("should respond with 400 and id does not exist if article_id is out of bounds", () => {
        return request(app)
        .get('/api/articles/50')
        .expect(404)
        .then(({ body }) => {
            expect(body.msg).toBe("No article found with that id")
        })
    })
})

describe("GET api/articles" , () => {
    it("should respond with 200 and an array of all articles with correct properties", () => {
        return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body }) => {
            expect(body.articles.length).not.toBe(0)
            body.articles.forEach((article) => {
                expect(article).toEqual(expect.objectContaining({
                    author: expect.any(String),
                    title: expect.any(String),
                    article_id: expect.any(Number),
                    topic: expect.any(String),
                    created_at: expect.any(String),
                    votes: expect.any(Number),
                    article_img_url: expect.any(String),
                    comment_count: expect.any(String)
                }))
            })
            expect(body.articles).toBeSorted({ descending: true })
            expect(body.articles.hasOwnProperty('body')).toBe(false)
        })
    })
})
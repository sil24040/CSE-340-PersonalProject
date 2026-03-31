import {
    getReviewById,
    createReview,
    updateReview,
    deleteReview,
  } from "../models/reviewModel.js"
  
  export async function postReview(req, res, next) {
    try {
      const vehicleId = Number(req.params.id)
      const { rating, comment } = req.body
      if (!rating || !comment || !comment.trim()) {
        return res.status(400).send("Missing rating or comment")
      }
      await createReview(req.session.user.id, vehicleId, rating, comment.trim())
      res.redirect(`/vehicles/${vehicleId}`)
    } catch (err) {
      next(err)
    }
  }
  
  export async function getEditReview(req, res, next) {
    try {
      const reviewId = Number(req.params.id)
      const review = await getReviewById(reviewId)
      if (!review) return res.status(404).send("Review not found")
      if (review.user_id !== req.session.user.id) return res.status(403).send("Access denied")
      res.render("edit-review", { review, error: null })
    } catch (err) {
      next(err)
    }
  }
  
  export async function postEditReview(req, res, next) {
    try {
      const reviewId = Number(req.params.id)
      const { rating, comment } = req.body
      if (!rating || !comment || !comment.trim()) {
        return res.status(400).send("Missing rating or comment")
      }
      const review = await getReviewById(reviewId)
      if (!review) return res.status(404).send("Review not found")
      if (review.user_id !== req.session.user.id) return res.status(403).send("Access denied")
      await updateReview(reviewId, rating, comment.trim())
      res.redirect(`/vehicles/${review.vehicle_id}`)
    } catch (err) {
      next(err)
    }
  }
  
  export async function postDeleteReview(req, res, next) {
    try {
      const reviewId = Number(req.params.id)
      const review = await getReviewById(reviewId)
      if (!review) return res.status(404).send("Review not found")
  
      const isAuthor = review.user_id === req.session.user.id
      const isModerator = ["employee", "owner"].includes(req.session.user.role)
      if (!isAuthor && !isModerator) return res.status(403).send("Access denied")
  
      await deleteReview(reviewId)
      const referer = req.get("Referer") || `/vehicles/${review.vehicle_id}`
      res.redirect(referer)
    } catch (err) {
      next(err)
    }
  }
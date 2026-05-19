import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../api/axios";
import { getCustomerId } from "../../api/auth";

// Feature 13: Customers can book appointments, request unavailable parts, and review services
export default function CustomerServices() {
  const customerId = getCustomerId();
  const navigate = useNavigate();

  const [appointment, setAppointment] = useState({ appointmentDate: "", serviceType: "" });
  const [partRequest, setPartRequest] = useState({ partName: "", description: "" });
  const [review, setReview] = useState({ comment: "", rating: 5 });

  const [message, setMessage] = useState("");
  const [msgType, setMsgType] = useState("success");

  if (!customerId) {
    navigate("/login", { replace: true });
    return null;
  }

  const flash = (type, text) => {
    setMsgType(type);
    setMessage(text);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBookAppointment = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/customeractions/book-appointment", {
        customerId,
        appointmentDate: new Date(appointment.appointmentDate).toISOString(),
        serviceType: appointment.serviceType.trim(),
      });
      setAppointment({ appointmentDate: "", serviceType: "" });
      flash("success", "Appointment booked. Status: Pending.");
    } catch {
      flash("error", "Could not book the appointment. Please check the date and try again.");
    }
  };

  const handleRequestPart = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/customeractions/request-part", {
        customerId,
        partName: partRequest.partName.trim(),
        description: partRequest.description.trim(),
      });
      setPartRequest({ partName: "", description: "" });
      flash("success", "Part request submitted. Status: Requested.");
    } catch {
      flash("error", "Could not submit the part request. Please try again.");
    }
  };

  const handleReview = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/customeractions/review-service", {
        customerId,
        comment: review.comment.trim(),
        rating: Number(review.rating),
      });
      setReview({ comment: "", rating: 5 });
      flash("success", "Thank you! Your review has been submitted.");
    } catch {
      flash("error", "Could not submit the review. Please try again.");
    }
  };

  const inputClass =
    "rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100";
  const cardClass = "rounded-[28px] bg-white p-8 shadow-xl shadow-slate-200";
  const btnClass =
    "rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700";

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="text-3xl font-semibold text-slate-900">Services</h1>
      <p className="mt-2 text-sm text-slate-500">
        Book a service appointment, request an unavailable part, or review our service.
      </p>

      {message && (
        <div
          className={`mt-6 rounded-3xl px-5 py-4 text-sm ${
            msgType === "success"
              ? "border border-emerald-200 bg-emerald-50 text-emerald-800"
              : "border border-rose-200 bg-rose-50 text-rose-800"
          }`}
        >
          {message}
        </div>
      )}

      {/* Book appointment */}
      <section className={`mt-8 ${cardClass}`}>
        <h2 className="text-lg font-semibold text-slate-900">Book a service appointment</h2>
        <form onSubmit={handleBookAppointment} className="mt-5 grid gap-4">
          <div className="grid gap-2">
            <label className="text-sm font-medium text-slate-700">Appointment date &amp; time</label>
            <input
              type="datetime-local"
              required
              className={inputClass}
              value={appointment.appointmentDate}
              onChange={(e) => setAppointment((p) => ({ ...p, appointmentDate: e.target.value }))}
            />
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium text-slate-700">Service type</label>
            <input
              required
              className={inputClass}
              placeholder="e.g. Engine service, Brake check"
              value={appointment.serviceType}
              onChange={(e) => setAppointment((p) => ({ ...p, serviceType: e.target.value }))}
            />
          </div>
          <button type="submit" className={btnClass}>
            Book appointment
          </button>
        </form>
      </section>

      {/* Request unavailable part */}
      <section className={`mt-8 ${cardClass}`}>
        <h2 className="text-lg font-semibold text-slate-900">Request an unavailable part</h2>
        <form onSubmit={handleRequestPart} className="mt-5 grid gap-4">
          <div className="grid gap-2">
            <label className="text-sm font-medium text-slate-700">Part name</label>
            <input
              required
              className={inputClass}
              placeholder="e.g. Turbo charger"
              value={partRequest.partName}
              onChange={(e) => setPartRequest((p) => ({ ...p, partName: e.target.value }))}
            />
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium text-slate-700">Description</label>
            <textarea
              rows={3}
              className={inputClass}
              placeholder="Vehicle model, specifications, etc."
              value={partRequest.description}
              onChange={(e) => setPartRequest((p) => ({ ...p, description: e.target.value }))}
            />
          </div>
          <button type="submit" className={btnClass}>
            Submit part request
          </button>
        </form>
      </section>

      {/* Review service */}
      <section className={`mt-8 ${cardClass}`}>
        <h2 className="text-lg font-semibold text-slate-900">Review our service</h2>
        <form onSubmit={handleReview} className="mt-5 grid gap-4">
          <div className="grid gap-2">
            <label className="text-sm font-medium text-slate-700">Rating</label>
            <select
              className={inputClass}
              value={review.rating}
              onChange={(e) => setReview((p) => ({ ...p, rating: e.target.value }))}
            >
              {[5, 4, 3, 2, 1].map((r) => (
                <option key={r} value={r}>
                  {r} star{r > 1 ? "s" : ""}
                </option>
              ))}
            </select>
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium text-slate-700">Comment</label>
            <textarea
              required
              rows={3}
              className={inputClass}
              placeholder="Tell us about your experience"
              value={review.comment}
              onChange={(e) => setReview((p) => ({ ...p, comment: e.target.value }))}
            />
          </div>
          <button type="submit" className={btnClass}>
            Submit review
          </button>
        </form>
      </section>
    </div>
  );
}

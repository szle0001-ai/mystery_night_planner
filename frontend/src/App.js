import { useState, useRef } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import {
  register,
  login,
  getEvents,
  createEvent,
  deleteEvent,
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  getAvailability,
  createAvailability,
  deleteAvailability,
  getFeedback,
  createFeedback,
  deleteFeedback
} from "./api";
import "./App.css";

function App() {
  const audioRef = useRef(null);

  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [feedback, setFeedback] = useState([]);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [availability, setAvailability] = useState([]);
  const [availabilityForm, setAvailabilityForm] = useState({
    available_date: "",
    status: "available"
  });
  const [feedbackForm, setFeedbackForm] = useState({
    game_title: "",
    rating: "5",
    comment: ""
  });
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [eventForm, setEventForm] = useState({
    title: "",
    description: "",
    location: "",
    event_date: ""
  });

  const refreshSharedData = async (activeToken) => {
    const [eventsData, availabilityData] = await Promise.all([
      getEvents(activeToken),
      getAvailability(activeToken)
    ]);
    setEvents(eventsData);
    setAvailability(availabilityData);
  };

  const handleRegister = async () => {
    try {
      setError("");
      setSuccess("");
      await register(registerName, registerEmail, registerPassword);
      setSuccess("Account created successfully. You can now log in.");
      setRegisterName("");
      setRegisterEmail("");
      setRegisterPassword("");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleLogin = async () => {
    try {
      setError("");
      setSuccess("");

      const data = await login(email, password);
      setToken(data.token);
      localStorage.setItem("token", data.token);

      await refreshSharedData(data.token);

      setSuccess("Logged in successfully.");

      if (audioRef.current) {
        audioRef.current.volume = 0.2;
        audioRef.current.play().catch((err) => {
          console.log("Autoplay blocked:", err);
        });
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleLogout = () => {
    setToken("");
    localStorage.removeItem("token");
    setEvents([]);
    setTasks([]);
    setFeedback([]);
    setAvailability([]);
    setSelectedEventId(null);
    setSuccess("Logged out.");
  };

  const loadEvents = async () => {
    try {
      setError("");
      const data = await getEvents(token);
      setEvents(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEventFormChange = (e) => {
    setEventForm({
      ...eventForm,
      [e.target.name]: e.target.value
    });
  };

  const handleCreateEvent = async () => {
    try {
      if (!eventForm.title || !eventForm.event_date) {
        setError("Title and date are required.");
        return;
      }

      setError("");
      await createEvent(eventForm, token);

      setEventForm({
        title: "",
        description: "",
        location: "",
        event_date: ""
      });

      const updatedEvents = await getEvents(token);
      setEvents(updatedEvents);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteEvent = async (eventId) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;

    try {
      setError("");
      await deleteEvent(eventId, token);

      const updatedEvents = await getEvents(token);
      setEvents(updatedEvents);

      if (selectedEventId === eventId) {
        setSelectedEventId(null);
        setTasks([]);
        setFeedback([]);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSelectEvent = async (eventId) => {
    try {
      setError("");
      setSelectedEventId(eventId);

      const [taskData, feedbackData] = await Promise.all([
        getTasks(eventId, token),
        getFeedback(eventId, token)
      ]);

      setTasks(taskData);
      setFeedback(feedbackData);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleAddTask = async () => {
    try {
      if (!newTaskTitle.trim() || !selectedEventId) return;

      setError("");
      await createTask(selectedEventId, newTaskTitle, token);
      setNewTaskTitle("");

      const updatedTasks = await getTasks(selectedEventId, token);
      setTasks(updatedTasks);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleToggleTask = async (taskId, currentValue) => {
    try {
      setError("");
      await updateTask(taskId, !currentValue, token);

      const updatedTasks = await getTasks(selectedEventId, token);
      setTasks(updatedTasks);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;

    try {
      setError("");
      await deleteTask(taskId, token);

      const updatedTasks = await getTasks(selectedEventId, token);
      setTasks(updatedTasks);
    } catch (err) {
      setError(err.message);
    }
  };

  const loadAvailability = async () => {
    try {
      setError("");
      const data = await getAvailability(token);
      setAvailability(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleAvailabilityChange = (e) => {
    setAvailabilityForm({
      ...availabilityForm,
      [e.target.name]: e.target.value
    });
  };

  const handleCreateAvailability = async () => {
    try {
      if (!availabilityForm.available_date) {
        setError("Please choose a date.");
        return;
      }

      setError("");
      await createAvailability(availabilityForm, token);
      setAvailabilityForm({ available_date: "", status: "available" });

      const updated = await getAvailability(token);
      setAvailability(updated);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteAvailability = async (id) => {
    if (!window.confirm("Are you sure you want to delete this availability?")) return;

    try {
      setError("");
      await deleteAvailability(id, token);
      const updated = await getAvailability(token);
      setAvailability(updated);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleFeedbackChange = (e) => {
    setFeedbackForm({
      ...feedbackForm,
      [e.target.name]: e.target.value
    });
  };

  const handleCreateFeedback = async () => {
    try {
      if (!selectedEventId) return;
      if (!feedbackForm.game_title || !feedbackForm.rating) {
        setError("Game title and rating are required.");
        return;
      }

      setError("");
      await createFeedback(selectedEventId, feedbackForm, token);

      setFeedbackForm({
        game_title: "",
        rating: "5",
        comment: ""
      });

      const updatedFeedback = await getFeedback(selectedEventId, token);
      setFeedback(updatedFeedback);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteFeedback = async (feedbackId) => {
    if (!window.confirm("Are you sure you want to delete this feedback?")) return;

    try {
      setError("");
      await deleteFeedback(feedbackId, token);
      const updatedFeedback = await getFeedback(selectedEventId, token);
      setFeedback(updatedFeedback);
    } catch (err) {
      setError(err.message);
    }
  };

  const selectedEvent = events.find((e) => e.id === selectedEventId);

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const selectedDateKey = formatDate(selectedDate);

  const selectedDateEntries = availability.filter(
    (entry) => entry.available_date.split("T")[0] === selectedDateKey
  );

  const selectedAvailable = selectedDateEntries.filter(
    (entry) => entry.status === "available"
  );

  const selectedUnavailable = selectedDateEntries.filter(
    (entry) => entry.status === "unavailable"
  );

  return (
    <div className="app-shell">
      <audio ref={audioRef} loop>
        <source src="/mystery-music.mp3" type="audio/mpeg" />
      </audio>

      <div className="app-container">
        <header className="hero">
          <div>
            <p className="eyebrow">Collaborative Event Planning</p>
            <h1>Mystery Night Planner</h1>
            <p className="hero-text">
              Organize detective game nights, shared tasks, group availability, and post-event feedback in one place.
            </p>
          </div>
          <div className="token-badge">
            {token ? "Logged in" : "Not logged in"}
          </div>
        </header>

        {error && <div className="error-banner">{error}</div>}
        {success && <div className="success-banner">{success}</div>}

        <div className="grid-two">
          <section className="card">
            <h2>Create Account</h2>
            <div className="form-group">
              <label>Name</label>
              <input
                className="input"
                value={registerName}
                onChange={(e) => setRegisterName(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                className="input"
                value={registerEmail}
                onChange={(e) => setRegisterEmail(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                className="input"
                type="password"
                value={registerPassword}
                onChange={(e) => setRegisterPassword(e.target.value)}
              />
            </div>
            <button className="btn btn-primary" onClick={handleRegister}>
              Create Account
            </button>
          </section>

          <section className="card">
            <h2>Login</h2>
            <div className="form-group">
              <label>Email</label>
              <input
                className="input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                className="input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="actions">
              <button className="btn btn-primary" onClick={handleLogin}>
                Login
              </button>
              {token && (
                <button className="btn btn-secondary" onClick={handleLogout}>
                  Logout
                </button>
              )}
            </div>
          </section>
        </div>

        <div className="grid-two">
          <section className="card">
            <h2>Create Event</h2>
            <div className="form-group">
              <label>Event Title</label>
              <input
                className="input"
                name="title"
                value={eventForm.title}
                onChange={handleEventFormChange}
                disabled={!token}
              />
            </div>
            <div className="form-group">
              <label>Location</label>
              <input
                className="input"
                name="location"
                value={eventForm.location}
                onChange={handleEventFormChange}
                disabled={!token}
              />
            </div>
            <div className="form-group">
              <label>Date and Time</label>
              <input
                className="input"
                name="event_date"
                type="datetime-local"
                value={eventForm.event_date}
                onChange={handleEventFormChange}
                disabled={!token}
              />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea
                className="input textarea"
                name="description"
                value={eventForm.description}
                onChange={handleEventFormChange}
                disabled={!token}
              />
            </div>
            <button
              className="btn btn-primary"
              onClick={handleCreateEvent}
              disabled={!token}
            >
              Create Event
            </button>
          </section>

          <section className="card">
            <div className="section-header">
              <h2>Events</h2>
              <button
                className="btn btn-secondary"
                onClick={loadEvents}
                disabled={!token}
              >
                Refresh Events
              </button>
            </div>

            {events.length === 0 ? (
              <p className="muted">No events loaded yet.</p>
            ) : (
              <div className="list">
                {events.map((event) => (
                  <div
                    key={event.id}
                    className={`list-item ${selectedEventId === event.id ? "selected" : ""}`}
                  >
                    <div>
                      <h3>{event.title}</h3>
                      <p className="muted">
                        {event.location ? `${event.location} • ` : ""}
                        {event.event_date
                          ? new Date(event.event_date).toLocaleString()
                          : ""}
                      </p>
                      <p className="muted">
                        Created by: {event.creator_name || "Unknown"}
                      </p>
                    </div>
                    <div className="actions">
                      <button
                        className="btn btn-secondary"
                        onClick={() => handleSelectEvent(event.id)}
                      >
                        Open
                      </button>
                      <button
                        className="btn btn-danger"
                        onClick={() => handleDeleteEvent(event.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        <div className="grid-two">
          <section className="card">
            <div className="section-header">
              <h2>
                {selectedEventId
                  ? `Checklist: ${selectedEvent ? selectedEvent.title : `Event ${selectedEventId}`}`
                  : "Checklist"}
              </h2>
            </div>

            {selectedEventId ? (
              <>
                <div className="inline-form">
                  <input
                    className="input"
                    placeholder="New task title"
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                  />
                  <button className="btn btn-primary" onClick={handleAddTask}>
                    Add Task
                  </button>
                </div>

                {tasks.length === 0 ? (
                  <p className="muted">No tasks yet for this event.</p>
                ) : (
                  <div className="list">
                    {tasks.map((task) => (
                      <div key={task.id} className="list-item">
                        <label className="checkbox-label">
                          <input
                            type="checkbox"
                            checked={task.completed}
                            onChange={() =>
                              handleToggleTask(task.id, task.completed)
                            }
                          />
                          <span className={task.completed ? "task-done" : ""}>
                            {task.title}
                          </span>
                        </label>
                        <button
                          className="btn btn-danger"
                          onClick={() => handleDeleteTask(task.id)}
                        >
                          Delete
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <p className="muted">Select an event to view its checklist.</p>
            )}
          </section>

          <section className="card">
            <div className="section-header">
              <h2>Event Feedback</h2>
            </div>

            {selectedEventId ? (
              <>
                <div className="form-group">
                  <label>Game Title</label>
                  <input
                    className="input"
                    name="game_title"
                    value={feedbackForm.game_title}
                    onChange={handleFeedbackChange}
                  />
                </div>

                <div className="form-group">
                  <label>Rating</label>
                  <select
                    className="input"
                    name="rating"
                    value={feedbackForm.rating}
                    onChange={handleFeedbackChange}
                  >
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Comment</label>
                  <textarea
                    className="input textarea"
                    name="comment"
                    value={feedbackForm.comment}
                    onChange={handleFeedbackChange}
                  />
                </div>

                <button
                  className="btn btn-primary"
                  onClick={handleCreateFeedback}
                >
                  Save Feedback
                </button>

                <div className="list feedback-list">
                  {feedback.length === 0 ? (
                    <p className="muted">No feedback yet for this event.</p>
                  ) : (
                    feedback.map((item) => (
                      <div key={item.id} className="list-item">
                        <div>
                          <h3>{item.game_title}</h3>
                          <p className="muted">Rating: {item.rating}/5</p>
                          <p className="muted">By: {item.user_name}</p>
                          {item.comment && <p>{item.comment}</p>}
                        </div>
                        <button
                          className="btn btn-danger"
                          onClick={() => handleDeleteFeedback(item.id)}
                        >
                          Delete
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </>
            ) : (
              <p className="muted">Select an event to add or view feedback.</p>
            )}
          </section>
        </div>

        <section className="card">
          <div className="section-header">
            <h2>Shared Availability Calendar</h2>
            <button
              className="btn btn-secondary"
              onClick={loadAvailability}
              disabled={!token}
            >
              Refresh Availability
            </button>
          </div>

          <div className="inline-form">
            <input
              className="input"
              type="date"
              name="available_date"
              value={availabilityForm.available_date}
              onChange={handleAvailabilityChange}
              disabled={!token}
            />

            <select
              className="input"
              name="status"
              value={availabilityForm.status}
              onChange={handleAvailabilityChange}
              disabled={!token}
            >
              <option value="available">Available</option>
              <option value="unavailable">Unavailable</option>
            </select>

            <button
              className="btn btn-primary"
              onClick={handleCreateAvailability}
              disabled={!token}
            >
              Save Availability
            </button>
          </div>

          <div className="calendar-wrapper">
            <Calendar
              onChange={setSelectedDate}
              value={selectedDate}
              tileClassName={({ date, view }) => {
                if (view !== "month") return null;

                const dateKey = formatDate(date);
                const entries = availability.filter(
                  (entry) => entry.available_date.split("T")[0] === dateKey
                );

                const hasAvailable = entries.some(
                  (e) => e.status === "available"
                );
                const hasUnavailable = entries.some(
                  (e) => e.status === "unavailable"
                );

                if (hasAvailable && hasUnavailable) return "calendar-mixed";
                if (hasAvailable) return "calendar-available";
                if (hasUnavailable) return "calendar-unavailable";

                return null;
              }}
            />
          </div>

          <div className="availability-group" style={{ marginTop: "16px" }}>
            <h3>{selectedDateKey}</h3>

            <div className="availability-columns">
              <div className="availability-box available-box">
                <strong>Available</strong>
                {selectedAvailable.length === 0 ? (
                  <p className="muted">No one marked available.</p>
                ) : (
                  selectedAvailable.map((entry) => (
                    <div key={entry.id} className="availability-entry">
                      <span>{entry.user_name}</span>
                      <button
                        className="btn btn-danger"
                        onClick={() => handleDeleteAvailability(entry.id)}
                      >
                        Delete
                      </button>
                    </div>
                  ))
                )}
              </div>

              <div className="availability-box unavailable-box">
                <strong>Unavailable</strong>
                {selectedUnavailable.length === 0 ? (
                  <p className="muted">No one marked unavailable.</p>
                ) : (
                  selectedUnavailable.map((entry) => (
                    <div key={entry.id} className="availability-entry">
                      <span>{entry.user_name}</span>
                      <button
                        className="btn btn-danger"
                        onClick={() => handleDeleteAvailability(entry.id)}
                      >
                        Delete
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default App;
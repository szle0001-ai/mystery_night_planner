const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

export const register = async (name, email, password) => {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ name, email, password })
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || "Registration failed");
  }

  return res.json();
};

export const login = async (email, password) => {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ email, password })
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || "Login failed");
  }

  return res.json();
};

export const getEvents = async (token) => {
  const res = await fetch(`${API_URL}/events`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || "Could not load events");
  }

  return res.json();
};

export const createEvent = async (eventData, token) => {
  const res = await fetch(`${API_URL}/events`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(eventData)
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || "Could not create event");
  }

  return res.json();
};

export const deleteEvent = async (eventId, token) => {
  const res = await fetch(`${API_URL}/events/${eventId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || "Could not delete event");
  }

  return res.json();
};

export const getTasks = async (eventId, token) => {
  const res = await fetch(`${API_URL}/events/${eventId}/tasks`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || "Could not load tasks");
  }

  return res.json();
};

export const createTask = async (eventId, title, token) => {
  const res = await fetch(`${API_URL}/events/${eventId}/tasks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      title,
      completed: false
    })
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || "Could not create task");
  }

  return res.json();
};

export const updateTask = async (taskId, completed, token) => {
  const res = await fetch(`${API_URL}/tasks/${taskId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ completed })
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || "Could not update task");
  }

  return res.json();
};

export const deleteTask = async (taskId, token) => {
  const res = await fetch(`${API_URL}/tasks/${taskId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || "Could not delete task");
  }

  return res.json();
};

export const getAvailability = async (token) => {
  const res = await fetch(`${API_URL}/availability`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || "Failed to fetch availability");
  }

  return res.json();
};

export const createAvailability = async (data, token) => {
  const res = await fetch(`${API_URL}/availability`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || "Failed to create availability");
  }

  return res.json();
};

export const deleteAvailability = async (id, token) => {
  const res = await fetch(`${API_URL}/availability/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || "Failed to delete availability");
  }

  return res.json();
};

export const getFeedback = async (eventId, token) => {
  const res = await fetch(`${API_URL}/events/${eventId}/feedback`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || "Could not load feedback");
  }

  return res.json();
};

export const createFeedback = async (eventId, data, token) => {
  const res = await fetch(`${API_URL}/events/${eventId}/feedback`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || "Could not create feedback");
  }

  return res.json();
};

export const deleteFeedback = async (feedbackId, token) => {
  const res = await fetch(`${API_URL}/feedback/${feedbackId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || "Could not delete feedback");
  }

  return res.json();
};
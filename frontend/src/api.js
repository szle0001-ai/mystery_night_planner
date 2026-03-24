const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

const parseResponse = async (res, defaultErrorMessage) => {
  const contentType = res.headers.get("content-type") || "";

  let data;

  if (contentType.includes("application/json")) {
    data = await res.json();
  } else {
    const text = await res.text();
    throw new Error(
      text || defaultErrorMessage || "Server returned a non-JSON response"
    );
  }

  if (!res.ok) {
    throw new Error(data.error || defaultErrorMessage || "Request failed");
  }

  return data;
};

export const register = async (name, email, password) => {
  const res = await fetch(${API_URL}/auth/register, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ name, email, password })
  });

  return parseResponse(res, "Registration failed");
};

export const login = async (email, password) => {
  const res = await fetch(${API_URL}/auth/login, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ email, password })
  });

  return parseResponse(res, "Login failed");
};

export const getEvents = async (token) => {
  const res = await fetch(${API_URL}/events, {
    method: "GET",
    headers: {
      Authorization: Bearer ${token}
    }
  });

  return parseResponse(res, "Could not load events");
};

export const createEvent = async (eventData, token) => {
  const res = await fetch(${API_URL}/events, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: Bearer ${token}
    },
    body: JSON.stringify(eventData)
  });

  return parseResponse(res, "Could not create event");
};

export const deleteEvent = async (eventId, token) => {
  const res = await fetch(${API_URL}/events/${eventId}, {
    method: "DELETE",
    headers: {
      Authorization: Bearer ${token}
    }
  });

  return parseResponse(res, "Could not delete event");
};

export const getTasks = async (eventId, token) => {
  const res = await fetch(${API_URL}/events/${eventId}/tasks, {
    method: "GET",
    headers: {
      Authorization: Bearer ${token}
    }
  });

  return parseResponse(res, "Could not load tasks");
};

export const createTask = async (eventId, title, token) => {
  const res = await fetch(${API_URL}/events/${eventId}/tasks, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: Bearer ${token}
    },
    body: JSON.stringify({
      title,
      completed: false
    })
  });

  return parseResponse(res, "Could not create task");
};

export const updateTask = async (taskId, completed, token) => {
  const res = await fetch(${API_URL}/tasks/${taskId}, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: Bearer ${token}
    },
    body: JSON.stringify({ completed })
  });

  return parseResponse(res, "Could not update task");
};

export const deleteTask = async (taskId, token) => {
  const res = await fetch(${API_URL}/tasks/${taskId}, {
    method: "DELETE",
    headers: {
      Authorization: Bearer ${token}
    }
  });

  return parseResponse(res, "Could not delete task");
};

export const getAvailability = async (token) => {
  const res = await fetch(${API_URL}/availability, {
    method: "GET",
    headers: {
      Authorization: Bearer ${token}
    }
  });

  return parseResponse(res, "Failed to fetch availability");
};

export const createAvailability = async (data, token) => {
  const res = await fetch(${API_URL}/availability, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: Bearer ${token}
    },
    body: JSON.stringify(data)
  });

  return parseResponse(res, "Failed to create availability");
};

export const deleteAvailability = async (id, token) => {
  const res = await fetch(${API_URL}/availability/${id}, {
    method: "DELETE",
    headers: {
      Authorization: Bearer ${token}
    }
  });

  return parseResponse(res, "Failed to delete availability");
};

export const getFeedback = async (eventId, token) => {
  const res = await fetch(${API_URL}/events/${eventId}/feedback, {
    method: "GET",
    headers: {
      Authorization: Bearer ${token}
    }
  });

  return parseResponse(res, "Could not load feedback");
};

export const createFeedback = async (eventId, data, token) => {
  const res = await fetch(${API_URL}/events/${eventId}/feedback, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: Bearer ${token}
    },
    body: JSON.stringify(data)
  });

  return parseResponse(res, "Could not create feedback");
};

export const deleteFeedback = async (feedbackId, token) => {
  const res = await fetch(${API_URL}/feedback/${feedbackId}, {
    method: "DELETE",
    headers: {
      Authorization: Bearer ${token}
    }
  });

  return parseResponse(res, "Could not delete feedback");
};

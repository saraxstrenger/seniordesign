export function validateDepartment(department) {
  if (department === undefined) {
    return undefined;
  }
  if (department.length < 2) {
    return undefined;
  }

  return department.toUpperCase();
}

export function validateCourseNumber(number) {
  // check if number is undefined or NaN
  if (number === undefined || isNaN(number)) {
    return undefined;
  }

  // check if number is of type number
  if (typeof number !== "number") {
    return parseInt(number);
  }
  return number;
}

export function validateYear(year) {
  if (year === undefined || isNaN(year)) {
    return undefined;
  }
  const currentYear = new Date().getFullYear();
  if (year < 1980 || year > currentYear) {
    return undefined;
  }
  if (typeof year !== "number") {
    return parseInt(year);
  }
  return year;
}

export function validateSemester(semester) {
  if (semester === undefined) {
    return undefined;
  }
  const validSemesters = ["Fall", "Spring", "Summer"];
  if (!validSemesters.includes(semester)) {
    return undefined;
  }
  const normalizedSemester =
    semester.charAt(0).toUpperCase() + semester.slice(1).toLowerCase();
  return normalizedSemester;
}

export function validateName(name) {
  if (name === undefined || !name.length) {
    return undefined;
  }
  if (name.length < 1) {
    return undefined;
  }
  return name;
}

export function validateUsername(username) {
  const alphaNumRegex = /^[a-zA-Z0-9]+$/;
  if (username === undefined || !username.length) {
    return undefined;
  }
  if (username.length < 1 || !username.match(alphaNumRegex)) {
    return undefined;
  }
  return username;
}

export function validatePassword(password) {
  const passwordRegex =
    /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).+$/;
  if (password === undefined || !password.length) {
    return undefined;
  }
  if (password.length < 8 || !password.match(passwordRegex)) {
    return undefined;
  }
  return password;
}

export function validateEmail(email) {
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  if (email === undefined || !email.length) {
    return undefined;
  }
  if (email.length < 1 || !email.match(emailRegex)) {
    return undefined;
  }
  return email;
}

export function validateMajor(major) {
  if (major === undefined) {
    return undefined;
  }
  if (major.length < 1) {
    return undefined;
  }
  return major;
}

export function validateRating(rating) {
  if (rating === undefined || isNaN(rating)) {
    return undefined;
  }
  if (rating < 0 || rating > 5) {
    return undefined;
  }
  return parseInt(rating);
}

export function validateWorkload(workload) {
  if (
    workload === undefined ||
    !Array.isArray(workload) ||
    workload.length !== 4
  ) {
    return undefined;
  }
  const workloadArr = [];
  for (let i = 0; i < workload.length; i++) {
    if (isNaN(workload[i])) {
      return undefined;
    }
    if (workload[i] < 0 || workload[i] > 5) {
      return undefined;
    }
  }
  return workload.map((x) => Math.round(x * 10) / 10);
}

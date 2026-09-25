const API_BASE_URL = 'http://localhost:3001/api';

// Rich mock data for demo mode or when backend / PostgreSQL isn't seeded/running
const initialMockClasses = [
  { id: 1, name: 'Cyber HIIT Inferno', trainer_id: 1, trainer_name: 'Marcus "Viper" Vance', time: '06:30 AM', capacity: 20, booked_count: 14, difficulty_level: 'Advanced', category: 'HIIT', calories: 650 },
  { id: 2, name: 'Iron Titan Hypertrophy', trainer_id: 2, trainer_name: 'Elena Rostova', time: '08:00 AM', capacity: 15, booked_count: 12, difficulty_level: 'Beast', category: 'Strength', calories: 500 },
  { id: 3, name: 'Zenith Vinyasa Flow', trainer_id: 3, trainer_name: 'Kai Chen', time: '10:00 AM', capacity: 25, booked_count: 9, difficulty_level: 'Beginner', category: 'Yoga', calories: 320 },
  { id: 4, name: 'Apex Combat & Strike', trainer_id: 4, trainer_name: 'Darius "The Hammer"', time: '05:30 PM', capacity: 16, booked_count: 15, difficulty_level: 'Advanced', category: 'Boxing', calories: 720 },
  { id: 5, name: 'Neon Pulse Spin Cycle', trainer_id: 1, trainer_name: 'Marcus "Viper" Vance', time: '07:00 PM', capacity: 22, booked_count: 19, difficulty_level: 'Intermediate', category: 'Spin', calories: 580 },
  { id: 6, name: 'Calisthenics & Rings Masterclass', trainer_id: 2, trainer_name: 'Elena Rostova', time: '08:30 PM', capacity: 12, booked_count: 6, difficulty_level: 'Beast', category: 'CrossFit', calories: 610 }
];

const initialMockTrainers = [
  { id: 1, name: 'Marcus "Viper" Vance', specialization: 'HIIT, MetCon & Agility', availability: 'Mon - Fri (06:00 - 14:00)', rating: 4.9, sessions: 412, badge: 'Master Coach' },
  { id: 2, name: 'Elena Rostova', specialization: 'Powerlifting, Hypertrophy & Calisthenics', availability: 'Tue - Sat (08:00 - 16:00)', rating: 5.0, sessions: 680, badge: 'Elite Athlete' },
  { id: 3, name: 'Kai Chen', specialization: 'Functional Mobility & Flow Yoga', availability: 'Mon - Thu (09:00 - 17:00)', rating: 4.8, sessions: 290, badge: 'Holistic Coach' },
  { id: 4, name: 'Darius "The Hammer"', specialization: 'Muay Thai, Boxing & Conditioning', availability: 'Wed - Sun (12:00 - 21:00)', rating: 4.9, sessions: 540, badge: 'Combat Specialist' }
];

const initialMockMembers = [
  { id: 1, username: 'ashwath', email: 'ash@apex.gym', age: 24, fitness_level: 'Beast', registration_date: '2026-01-15', streak_days: 18, total_workouts: 84 },
  { id: 2, username: 'sara_connor', email: 'sara@apex.gym', age: 29, fitness_level: 'Advanced', registration_date: '2026-02-01', streak_days: 12, total_workouts: 52 },
  { id: 3, username: 'neo_anderson', email: 'neo@apex.gym', age: 31, fitness_level: 'Beast', registration_date: '2026-02-14', streak_days: 25, total_workouts: 110 },
  { id: 4, username: 'maya_fit', email: 'maya@apex.gym', age: 22, fitness_level: 'Intermediate', registration_date: '2026-03-01', streak_days: 7, total_workouts: 31 },
  { id: 5, username: 'jordan_b', email: 'jordan@apex.gym', age: 36, fitness_level: 'Beginner', registration_date: '2026-03-10', streak_days: 3, total_workouts: 14 }
];

const initialMockBookings = [
  { id: 1, member_id: 1, class_id: 1, class_name: 'Cyber HIIT Inferno', time: '06:30 AM', booked_date: '2026-09-21', status: 'confirmed', qr_code: 'APEX-PASS-88219' },
  { id: 2, member_id: 1, class_id: 2, class_name: 'Iron Titan Hypertrophy', time: '08:00 AM', booked_date: '2026-09-22', status: 'confirmed', qr_code: 'APEX-PASS-99341' }
];

const initialMockAttendance = [
  { id: 1, member_id: 1, member_name: 'Ashwath', class_id: 1, class_name: 'Cyber HIIT Inferno', attended_date: '2026-09-19', check_in_time: '06:24 AM', status: 'Verified' },
  { id: 2, member_id: 3, member_name: 'Neo Anderson', class_id: 4, class_name: 'Apex Combat & Strike', attended_date: '2026-09-19', check_in_time: '05:15 PM', status: 'Verified' },
  { id: 3, member_id: 2, member_name: 'Sara Connor', class_id: 2, class_name: 'Iron Titan Hypertrophy', attended_date: '2026-09-18', check_in_time: '07:55 AM', status: 'Verified' }
];

// Helper to manage localStorage mock state
function getStorage(key, defaultVal) {
  const v = localStorage.getItem('gym_mock_' + key);
  return v ? JSON.parse(v) : defaultVal;
}

function setStorage(key, val) {
  localStorage.setItem('gym_mock_' + key, JSON.stringify(val));
}

// Request helper with auto-fallback to mock data
async function request(endpoint, options = {}, mockFallbackFn) {
  const token = localStorage.getItem('token') || localStorage.getItem('managerToken');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...(options.headers || {})
  };

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000); // 2s timeout for swift response

    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      return { data, isLive: true };
    }
    throw new Error(`Status ${res.status}`);
  } catch (err) {
    // Graceful fallback to mock data
    console.warn(`[Apex OS API] Using interactive fallback for ${endpoint}:`, err.message);
    const mockData = await mockFallbackFn();
    return { data: mockData, isLive: false };
  }
}

export const api = {
  // Auth — NO mock fallback. Must hit real backend or fail.
  async login(username, password) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || data.message || 'Invalid credentials');
      return { data, isLive: true };
    } catch (err) {
      if (err.name === 'AbortError') throw new Error('Server not responding. Is the backend running on port 3001?');
      throw err;
    }
  },

  async register(username, email, password, age, fitness_level) {
    return request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, email, password, age, fitness_level })
    }, () => {
      return { message: 'User registered successfully', userId: 99 };
    });
  },

  // Classes
  async getClasses() {
    return request('/classes', { method: 'GET' }, () => {
      const stored = getStorage('classes', initialMockClasses);
      return { classes: stored };
    });
  },

  async createClass(classData) {
    return request('/classes', {
      method: 'POST',
      body: JSON.stringify(classData)
    }, () => {
      const stored = getStorage('classes', initialMockClasses);
      const newClass = { id: Date.now(), booked_count: 0, ...classData };
      const updated = [newClass, ...stored];
      setStorage('classes', updated);
      return { message: 'Class created successfully', newClass };
    });
  },

  async deleteClass(id) {
    return request(`/classes/${id}`, { method: 'DELETE' }, () => {
      const stored = getStorage('classes', initialMockClasses);
      const updated = stored.filter(c => c.id !== Number(id));
      setStorage('classes', updated);
      return { message: 'Class removed successfully' };
    });
  },

  // Bookings
  async getBookings() {
    const res = await request('/bookings', { method: 'GET' }, () => {
      const stored = getStorage('bookings', initialMockBookings);
      return { bookings: stored };
    });

    const rawBookings = res.data?.bookings || [];

    try {
      const classesRes = await this.getClasses();
      const classesList = classesRes.data?.classes || [];

      const enriched = rawBookings.map(b => {
        const matched = classesList.find(c => Number(c.id) === Number(b.class_id));
        return {
          ...b,
          class_name: b.class_name || (matched ? matched.name : `Class #${b.class_id}`),
          time: b.time || (matched ? matched.time : '10:00 AM'),
          qr_code: b.qr_code || `OPTIMUS-PASS-${String(b.id || 99).padStart(5, '0')}`
        };
      });

      return { ...res, data: { ...res.data, bookings: enriched } };
    } catch (e) {
      return res;
    }
  },

  async createBooking(bookingData) {
    return request('/bookings', {
      method: 'POST',
      body: JSON.stringify(bookingData)
    }, () => {
      const stored = getStorage('bookings', initialMockBookings);
      const classes = getStorage('classes', initialMockClasses);
      const targetClass = classes.find(c => c.id === Number(bookingData.class_id));

      const newBooking = {
        id: Date.now(),
        member_id: bookingData.member_id || 1,
        class_id: bookingData.class_id,
        class_name: targetClass ? targetClass.name : `Class #${bookingData.class_id}`,
        time: targetClass ? targetClass.time : '10:00 AM',
        booked_date: bookingData.booked_date || new Date().toISOString().split('T')[0],
        status: 'confirmed',
        qr_code: `APEX-PASS-${Math.floor(10000 + Math.random() * 90000)}`
      };

      const updated = [newBooking, ...stored];
      setStorage('bookings', updated);
      return { message: 'Booking created', bookingId: newBooking.id, booking: newBooking };
    });
  },

  async cancelBooking(id) {
    return request(`/bookings/${id}`, { method: 'DELETE' }, () => {
      const stored = getStorage('bookings', initialMockBookings);
      const updated = stored.filter(b => b.id !== Number(id));
      setStorage('bookings', updated);
      return { message: 'Bookings removed successfully' };
    });
  },

  // Members
  async getMembers() {
    return request('/members', { method: 'GET' }, () => {
      const stored = getStorage('members', initialMockMembers);
      return { members: stored };
    });
  },

  async createMember(memberData) {
    return request('/members', {
      method: 'POST',
      body: JSON.stringify(memberData)
    }, () => {
      const stored = getStorage('members', initialMockMembers);
      const newMember = {
        id: Date.now(),
        username: memberData.username || 'new_athlete',
        email: memberData.email || 'athlete@apex.gym',
        age: Number(memberData.age) || 25,
        fitness_level: memberData.fitness_level || 'Beginner',
        registration_date: new Date().toISOString().split('T')[0],
        streak_days: 1,
        total_workouts: 1
      };
      setStorage('members', [newMember, ...stored]);
      return { message: 'Member created successfully', member: newMember };
    });
  },

  async deleteMember(id) {
    return request(`/members/${id}`, { method: 'DELETE' }, () => {
      const stored = getStorage('members', initialMockMembers);
      const updated = stored.filter(m => m.id !== Number(id));
      setStorage('members', updated);
      return { message: 'Member removed successfully' };
    });
  },

  // Trainers
  async getTrainers() {
    return request('/trainers', { method: 'GET' }, () => {
      const stored = getStorage('trainers', initialMockTrainers);
      return { trainers: stored };
    });
  },

  async createTrainer(trainerData) {
    return request('/trainers', {
      method: 'POST',
      body: JSON.stringify(trainerData)
    }, () => {
      const stored = getStorage('trainers', initialMockTrainers);
      const newTrainer = {
        id: Date.now(),
        name: trainerData.name,
        specialization: trainerData.specialization,
        availability: trainerData.availability,
        rating: 5.0,
        sessions: 0,
        badge: 'New Coach'
      };
      setStorage('trainers', [...stored, newTrainer]);
      return { message: 'trainers created successfully', trainer: newTrainer };
    });
  },

  async deleteTrainer(id) {
    return request(`/trainers/${id}`, { method: 'DELETE' }, () => {
      const stored = getStorage('trainers', initialMockTrainers);
      const updated = stored.filter(t => t.id !== Number(id));
      setStorage('trainers', updated);
      return { message: 'Trainer removed successfully' };
    });
  },

  // Attendance
  async getAttendance() {
    return request('/attendance', { method: 'GET' }, () => {
      const stored = getStorage('attendance', initialMockAttendance);
      return { attendance: stored };
    });
  },

  async checkIn(attendanceData) {
    return request('/attendance', {
      method: 'POST',
      body: JSON.stringify(attendanceData)
    }, () => {
      const stored = getStorage('attendance', initialMockAttendance);
      const newRecord = {
        id: Date.now(),
        member_id: attendanceData.member_id || 1,
        member_name: attendanceData.member_name || 'Current Athlete',
        class_id: attendanceData.class_id || 1,
        class_name: attendanceData.class_name || 'Gym Floor Entry',
        attended_date: attendanceData.attended_date || new Date().toISOString().split('T')[0],
        check_in_time: attendanceData.check_in_time || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'Verified'
      };
      setStorage('attendance', [newRecord, ...stored]);
      return { message: 'Attendance created successfully', record: newRecord };
    });
  }
};

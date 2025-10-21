// Hotel Booking System JavaScript

class HotelBookingSystem {
    constructor() {
        this.bookings = JSON.parse(localStorage.getItem('hotelBookings')) || [];
        this.rooms = [
            {
                id: 1,
                type: 'standard',
                name: 'Standard Room',
                price: 100,
                features: ['Queen Bed', 'Free WiFi', 'Air Conditioning', 'TV', 'Private Bathroom'],
                available: true
            },
            {
                id: 2,
                type: 'deluxe',
                name: 'Deluxe Room',
                price: 150,
                features: ['King Bed', 'Free WiFi', 'Air Conditioning', 'Smart TV', 'Mini Bar', 'Balcony'],
                available: true
            },
            {
                id: 3,
                type: 'suite',
                name: 'Executive Suite',
                price: 250,
                features: ['King Bed', 'Separate Living Area', 'Free WiFi', 'Smart TV', 'Mini Bar', 'Balcony', 'Room Service'],
                available: true
            },
            {
                id: 4,
                type: 'presidential',
                name: 'Presidential Suite',
                price: 500,
                features: ['King Bed', 'Separate Living & Dining', 'Free WiFi', 'Multiple TVs', 'Full Bar', 'Private Balcony', '24/7 Butler Service', 'Jacuzzi'],
                available: true
            }
        ];
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.displayRooms();
        this.displayBookings();
        this.setMinDate();
    }

    setupEventListeners() {
        const bookingForm = document.getElementById('bookingForm');
        const modal = document.getElementById('confirmationModal');
        const closeModal = document.getElementById('closeModal');
        const closeBtn = document.querySelector('.close');

        bookingForm.addEventListener('submit', (e) => this.handleBooking(e));
        closeModal.addEventListener('click', () => this.closeModal());
        closeBtn.addEventListener('click', () => this.closeModal());
        
        // Close modal when clicking outside
        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeModal();
            }
        });

        // Update checkout date when checkin date changes
        document.getElementById('checkIn').addEventListener('change', (e) => {
            this.updateCheckoutDate(e.target.value);
        });
    }

    setMinDate() {
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('checkIn').min = today;
        document.getElementById('checkOut').min = today;
    }

    updateCheckoutDate(checkInDate) {
        const checkOutInput = document.getElementById('checkOut');
        const checkIn = new Date(checkInDate);
        const nextDay = new Date(checkIn);
        nextDay.setDate(nextDay.getDate() + 1);
        
        checkOutInput.min = nextDay.toISOString().split('T')[0];
        
        // If current checkout date is before new minimum, update it
        if (checkOutInput.value && checkOutInput.value <= checkInDate) {
            checkOutInput.value = nextDay.toISOString().split('T')[0];
        }
    }

    handleBooking(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const bookingData = {
            id: this.generateBookingId(),
            guestName: formData.get('guestName'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            roomType: formData.get('roomType'),
            checkIn: formData.get('checkIn'),
            checkOut: formData.get('checkOut'),
            guests: formData.get('guests'),
            specialRequests: formData.get('specialRequests'),
            status: 'confirmed',
            bookingDate: new Date().toISOString().split('T')[0]
        };

        // Calculate total cost
        const room = this.rooms.find(r => r.type === bookingData.roomType);
        const checkIn = new Date(bookingData.checkIn);
        const checkOut = new Date(bookingData.checkOut);
        const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
        bookingData.totalCost = room.price * nights;
        bookingData.nights = nights;

        // Add booking
        this.bookings.push(bookingData);
        this.saveBookings();
        
        // Show confirmation
        this.showConfirmation(bookingData);
        
        // Update displays
        this.displayBookings();
        this.displayRooms();
        
        // Reset form
        e.target.reset();
        this.setMinDate();
    }

    generateBookingId() {
        return 'BK' + Date.now().toString().slice(-6);
    }

    showConfirmation(booking) {
        const modal = document.getElementById('confirmationModal');
        const detailsDiv = document.getElementById('confirmationDetails');
        
        const room = this.rooms.find(r => r.type === booking.roomType);
        
        detailsDiv.innerHTML = `
            <div class="confirmation-details">
                <div><strong>Booking ID:</strong> <span>${booking.id}</span></div>
                <div><strong>Guest Name:</strong> <span>${booking.guestName}</span></div>
                <div><strong>Email:</strong> <span>${booking.email}</span></div>
                <div><strong>Phone:</strong> <span>${booking.phone}</span></div>
                <div><strong>Room Type:</strong> <span>${room.name}</span></div>
                <div><strong>Check-in:</strong> <span>${this.formatDate(booking.checkIn)}</span></div>
                <div><strong>Check-out:</strong> <span>${this.formatDate(booking.checkOut)}</span></div>
                <div><strong>Guests:</strong> <span>${booking.guests}</span></div>
                <div><strong>Nights:</strong> <span>${booking.nights}</span></div>
                <div><strong>Total Cost:</strong> <span>$${booking.totalCost}</span></div>
                ${booking.specialRequests ? `<div><strong>Special Requests:</strong> <span>${booking.specialRequests}</span></div>` : ''}
            </div>
        `;
        
        modal.style.display = 'block';
    }

    closeModal() {
        document.getElementById('confirmationModal').style.display = 'none';
    }

    displayRooms() {
        const roomsGrid = document.getElementById('roomsGrid');
        roomsGrid.innerHTML = '';

        this.rooms.forEach(room => {
            const roomCard = document.createElement('div');
            roomCard.className = `room-card ${room.available ? 'available' : 'occupied'}`;
            
            roomCard.innerHTML = `
                <div class="room-header">
                    <div class="room-type">${room.name}</div>
                    <div class="room-price">$${room.price}/night</div>
                </div>
                <ul class="room-features">
                    ${room.features.map(feature => `<li><i class="fas fa-check"></i>${feature}</li>`).join('')}
                </ul>
                <div class="room-status ${room.available ? 'available' : 'occupied'}">
                    ${room.available ? 'Available' : 'Occupied'}
                </div>
            `;
            
            roomsGrid.appendChild(roomCard);
        });
    }

    displayBookings() {
        const bookingsList = document.getElementById('bookingsList');
        
        if (this.bookings.length === 0) {
            bookingsList.innerHTML = '<p class="no-bookings">No bookings yet. Make your first reservation!</p>';
            return;
        }

        bookingsList.innerHTML = this.bookings.map(booking => {
            const room = this.rooms.find(r => r.type === booking.roomType);
            
            return `
                <div class="booking-item">
                    <div class="booking-header">
                        <div class="booking-id">${booking.id}</div>
                        <div class="booking-status">${booking.status}</div>
                    </div>
                    <div class="booking-details">
                        <div class="booking-detail">
                            <label>Guest Name</label>
                            <span>${booking.guestName}</span>
                        </div>
                        <div class="booking-detail">
                            <label>Room Type</label>
                            <span>${room.name}</span>
                        </div>
                        <div class="booking-detail">
                            <label>Check-in</label>
                            <span>${this.formatDate(booking.checkIn)}</span>
                        </div>
                        <div class="booking-detail">
                            <label>Check-out</label>
                            <span>${this.formatDate(booking.checkOut)}</span>
                        </div>
                        <div class="booking-detail">
                            <label>Guests</label>
                            <span>${booking.guests}</span>
                        </div>
                        <div class="booking-detail">
                            <label>Total Cost</label>
                            <span>$${booking.totalCost}</span>
                        </div>
                    </div>
                    ${booking.specialRequests ? `
                        <div class="booking-detail">
                            <label>Special Requests</label>
                            <span>${booking.specialRequests}</span>
                        </div>
                    ` : ''}
                </div>
            `;
        }).join('');
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    saveBookings() {
        localStorage.setItem('hotelBookings', JSON.stringify(this.bookings));
    }

    // Method to simulate room availability changes
    updateRoomAvailability() {
        // This could be connected to a real backend
        // For demo purposes, we'll randomly update availability
        this.rooms.forEach(room => {
            room.available = Math.random() > 0.3; // 70% chance of being available
        });
        this.displayRooms();
    }
}

// Initialize the booking system when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new HotelBookingSystem();
});

// Optional: Update room availability every 30 seconds for demo purposes
setInterval(() => {
    if (window.hotelBookingSystem) {
        window.hotelBookingSystem.updateRoomAvailability();
    }
}, 30000);


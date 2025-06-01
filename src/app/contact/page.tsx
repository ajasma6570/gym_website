export default function Contact() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">Contact Us</h1>
          <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Address</h3>
                <p className="text-gray-600">
                  123 Fitness Street, Workout City, WC 12345
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Phone</h3>
                <p className="text-gray-600">(555) 123-4567</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Email</h3>
                <p className="text-gray-600">info@gym.com</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Hours</h3>
                <p className="text-gray-600">Mon-Fri: 5:00 AM - 11:00 PM</p>
                <p className="text-gray-600">Sat-Sun: 6:00 AM - 10:00 PM</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

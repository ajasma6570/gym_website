export default function Contact() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center pt-20 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold  mb-6">Contact Us</h1>
          <p className="text-lg text-red-600 mb-8">
            This page is currently under construction. In the meantime, feel
            free to reach out using the details below:
          </p>
          <div className="max-w-md mx-auto  rounded-lg shadow-md p-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold ">Address</h3>
                <p className="text-neutral-300">
                  123 Fitness Street, Workout City, WC 12345
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold ">Phone</h3>
                <p className="text-neutral-300">(555) 123-4567</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold ">Email</h3>
                <p className="text-neutral-300">info@gym.com</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold ">Hours</h3>
                <p className="text-neutral-300">Mon-Fri: 5:00 AM - 11:00 PM</p>
                <p className="text-neutral-300">Sat-Sun: 6:00 AM - 10:00 PM</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

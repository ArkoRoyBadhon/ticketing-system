

const HomeView = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <section className="bg-violet-50 py-16 h-[40vh]">
        <div className="containerMain mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4 text-violet-600">
            Welcome to the Complaint Management System
          </h2>
          <p className="text-gray-700 mb-6">
            Easily manage, track, and resolve complaints efficiently.
          </p>

        </div>
      </section>

      <section id="features" className="py-16">
        <div className="containerMain mx-auto text-center">
          <h3 className="text-2xl font-bold mb-8">Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-white rounded-lg shadow-md">
              <h4 className="text-lg font-bold text-violet-600 mb-2">
                Easy Submission
              </h4>
              <p className="text-gray-600">
                Submit complaints quickly using our intuitive interface.
              </p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-md">
              <h4 className="text-lg font-bold text-violet-600 mb-2">
                Real-Time Tracking
              </h4>
              <p className="text-gray-600">
                Track the status of complaints in real time.
              </p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-md">
              <h4 className="text-lg font-bold text-violet-600 mb-2">
                Efficient Resolution
              </h4>
              <p className="text-gray-600">
                Ensure timely and effective resolution of complaints.
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default HomeView;

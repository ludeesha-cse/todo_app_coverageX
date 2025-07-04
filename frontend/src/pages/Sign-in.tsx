const SignIn = () => {
  return (
    <div className="max-w-md mx-auto mt-10">
      <h2 className="text-2xl mb-4">Sign In</h2>
      <form className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 border rounded"
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 border rounded"
        />
        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
          Sign In
        </button>
      </form>
    </div>
  );
};

export default SignIn;
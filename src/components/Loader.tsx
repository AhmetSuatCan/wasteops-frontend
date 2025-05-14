import { FiLoader } from 'react-icons/fi';

const Loader = ({ title = '', duration = 2000, animationPing = false }) => (
  <div
    className="loader fixed flex items-center justify-center bg-white bg-opacity-90 w-full h-screen *:size-16 z-50"
    style={{
      animationDuration: `${duration}ms`,
      animationIterationCount: `${animationPing ? 'infinite' : '1'}`,
    }}
  >
    <div className="inline-flex items-center justify-center gap-5">
      <FiLoader
        className={`icon ${animationPing && '!animate-ping'} text-5xl text-blue-500`}
        style={{ animationDuration: `${duration}ms` }}
      />
      {title && !animationPing && (
        <span className="title text-5xl font-semibold" style={{ animationDuration: `${duration}ms` }}>
          {title}
        </span>
      )}
    </div>
  </div>
);

export default Loader;


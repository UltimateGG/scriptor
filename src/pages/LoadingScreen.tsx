interface ILoadingScreenProps {
  status: string;
}

const LoadingScreen = ({ status }: ILoadingScreenProps) => {
  return (
    <div className="flex flex-col justify-center items-center h-full">
      <h1 className="status">{status}</h1>

      <img className="logo" src="/logo192.png" alt="Scriptor" />
    </div>
  );
}

export default LoadingScreen;

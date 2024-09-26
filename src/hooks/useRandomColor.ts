const useGenerateRandomColor = () => {
  const generateColor = (): string => {
    return Math.random().toString(16).substr(-6)
  };
  return [generateColor];

};
export default useGenerateRandomColor;
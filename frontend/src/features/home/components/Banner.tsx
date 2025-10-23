import banner1 from '../../../assets/banner1.webp'

const Banner = () => {
  return (
    <div className="w-full overflow-hidden">
      <img
        src={banner1}
        alt="Big Bang Diwali"
        className="w-full object-cover"
      />
    </div>
  );
};

export default Banner;

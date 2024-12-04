const getPercentage = (price1, price2) => {
  return Math.abs(Math.round(((price2 - price1) / price1) * 100));
};

export default getPercentage;

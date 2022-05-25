export const formatCash = (str) => {
  str = str.split("").reverse();
  let result = "";
  for (let index in str) {
    if (index % 3 === 0 && index != 0) {
      result += ",";
    }
    result += str[index];
  }

  return result.split("").reverse().join("");
};

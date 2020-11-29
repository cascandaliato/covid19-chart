const getAngle = () => {
  const element = document
    .querySelector(".cartesianlayer")
    .querySelector(".plot")
    .querySelector(".scatterlayer")
    .lastElementChild.querySelector(".lines")
    .firstElementChild.getAttribute("d");

  const pts = element
    .split("M")
    .join(",")
    .split("L")
    .join(",")
    .split(",")
    .filter((e) => e !== "");

  return (Math.atan2(pts[3] - pts[1], pts[2] - pts[0]) * 180) / Math.PI;
};

export default getAngle;

export default function CheckRankUser(cup: number): string {
  let rank: string = "";
  if (cup < 100) {
    rank = "Iron";
  } else if (cup < 200) {
    rank = "Bronze";
  } else if (cup < 300) {
    rank = "Gold";
  } else if (cup < 400) {
    rank = "Platinum";
  } else if (cup < 500) {
    rank = "Diamond";
  } else {
    rank = "Master"
  }
  return rank;
}

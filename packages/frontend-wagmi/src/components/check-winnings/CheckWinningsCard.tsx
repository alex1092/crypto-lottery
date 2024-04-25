import Link from "next/link";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";

export const CheckWinningsCard = () => {
  const totalWinnings = 0;
  return (
    <Card>
      <CardHeader>
        <CardTitle>Check Winnings</CardTitle>
        <CardDescription>🤞</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Holy Shit you won {totalWinnings ?? 0}</p>

        <p>Better luck next time champ</p>
        <Link href={"https://careers.mcdonalds.com/"}>
          <Button variant={"link"}>McDonalds Careers</Button>
        </Link>
      </CardContent>

      <CardFooter className="flex justify-center">
        <Button>Check Winnings</Button>
      </CardFooter>
    </Card>
  );
};

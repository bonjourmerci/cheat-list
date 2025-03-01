import { Input } from "@/components/input";
import { Textarea } from "@/components/textarea";
import { Title } from "@/components/title";
import { Label } from "@/components/label";
import { Button } from "@/components/button";

export default function Page() {
  return (
    <>
      <Title />
      <form className="flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <Label htmlFor="author_username">Ton instagram</Label>
          <Input
            id="author_username"
            placeholder="your_instagram"
            pattern="(?!.*\.\.)(?!.*\.$)[a-zA-Z0-9_][a-zA-Z0-9_.]{0,28}"
            required
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="cheater_username">Son instagram</Label>
          <Input
            id="cheater_username"
            placeholder="cheater_instagram"
            pattern="(?!.*\.\.)(?!.*\.$)[a-zA-Z0-9_][a-zA-Z0-9_.]{0,28}"
            required
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="story">Histoire</Label>
          <Textarea
            id="story"
            placeholder="Que s'est-il passé ?"
            className="min-h-[300px]"
            required
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="proof_path">Preuve</Label>
          <Input id="proof_path" type="file" />
        </div>
        <Button type="submit">Envoyer</Button>
      </form>
    </>
  );
}

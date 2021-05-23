export interface Question {
  asker: string;
  askee: string;
  question: string;
  answer: string;
}

export interface ParanoiaOperators {
  askPlayer(player: string, question: string): Promise<string | undefined>;
  choosePlayers(): Promise<[string, string]>;
  getQuestion(player: string): Promise<string | undefined>;
  showQuestion(): Promise<boolean>;
  displayResult(question: Question): Promise<void>;
  displayHidden(): Promise<void>;
}

export async function paranoiaStep(operations: ParanoiaOperators) {
  const [asker, askee] = await operations.choosePlayers();
  const question = await operations.getQuestion(asker);
  if (question === undefined) {
    // TODO
  }
  const answer = await operations.askPlayer(askee, question);
  if (answer === undefined) {
    // TODO
  }
  const showQuestion = await operations.showQuestion();
  if (showQuestion) {
    await operations.displayResult({
      asker,
      askee,
      question,
      answer,
    });
  } else {
    await operations.displayHidden();
  }
}

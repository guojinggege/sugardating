import { redirect } from "next/navigation";
export const dynamic = "force-dynamic";
export default function QuestionIndexRedirect() { redirect("/community/questions"); }

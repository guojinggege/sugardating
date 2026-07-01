// Travel Plan — Current City / Upcoming Cities / Wish List / Favorite Restaurant/Hotel/Activities
import { getTranslations } from "next-intl/server";

export interface TravelData {
  currentCity: string;
  upcoming: { city: string; date: string }[];
  wishList: string[];
  favRestaurants: string[];
  favHotels: string[];
  favActivities: string[];
}

export default async function TravelPlan({ data }: { data: TravelData }) {
  const t = await getTranslations("creatorProfile.travel");

  const block = (title: string, children: React.ReactNode) => (
    <div className="cr-tp-block">
      <h5 className="cr-tp-h">{title}</h5>
      {children}
    </div>
  );

  return (
    <div className="cr-tp">
      <div className="cr-tp-grid">
        {block(t("currentCity"),
          <div className="cr-tp-current">
            <span className="cr-tp-pin" aria-hidden>📍</span>
            <span className="cr-tp-city">{data.currentCity}</span>
          </div>
        )}
        {block(t("upcoming"),
          <ul className="cr-tp-list">
            {data.upcoming.map((u, i) => (
              <li key={i}><span className="cr-tp-dot" />{u.city} <em>· {u.date}</em></li>
            ))}
          </ul>
        )}
        {block(t("wishList"),
          <div className="cr-tp-chips">
            {data.wishList.map((w) => <span key={w} className="cr-tp-chip">{w}</span>)}
          </div>
        )}
        {block(t("restaurants"),
          <ul className="cr-tp-list-plain">
            {data.favRestaurants.map((r) => <li key={r}>· {r}</li>)}
          </ul>
        )}
        {block(t("hotels"),
          <ul className="cr-tp-list-plain">
            {data.favHotels.map((h) => <li key={h}>· {h}</li>)}
          </ul>
        )}
        {block(t("activities"),
          <div className="cr-tp-chips">
            {data.favActivities.map((a) => <span key={a} className="cr-tp-chip">{a}</span>)}
          </div>
        )}
      </div>
    </div>
  );
}

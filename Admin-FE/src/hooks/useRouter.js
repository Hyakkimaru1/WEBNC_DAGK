// libs import
import { useMemo } from "react";
import {
  useParams,
  useLocation,
  useHistory,
  useRouteMatch
} from "react-router-dom";
import queryString from "query-string";
// others
import CONSTANTS from "@/constants";

// Hook
export const useRouter = () => {
  const params = useParams();
  const location = useLocation();
  const history = useHistory();
  const match = useRouteMatch();

  const { pathname } = location;

  // define urlEndpoint by substring pathname
  // case 1: pathname == ["/en/xxx", "/ja/xxx"]
  // case 2: pathname == ["/xxx"]
  // endpoint = /xxx
  const pageEndpoint = CONSTANTS.LOCALE.PATH_REGEX.test(pathname)
    ? pathname.substring(CONSTANTS.LOCALE.LOCALE_LENGTH + 1, pathname.length)
    : pathname;

  // Return our custom router object
  // Memoize so that a new object is only returned if something changes
  return useMemo(
    () => ({
      // For convenience add push(), replace(), pathname at top level
      push: history.push,
      replace: history.replace,
      pathname,
      // Merge params and parsed query string into single "query" object
      // so that they can be used interchangeably.
      // Example: /:topic?sort=popular -> { topic: "react", sort: "popular" }
      query: {
        ...queryString.parse(location.search), // Convert string to object
        ...params
      },
      // Include match, location, history objects so we have
      // access to extra React Router functionality if needed.
      match,
      location,
      history,
      pageEndpoint
    }),
    [params, match, location, history, pathname, pageEndpoint]
  );
};

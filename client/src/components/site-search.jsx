export default function SiteSearch({className = ''}) {
  function handleSubmit(event) {
    event.preventDefault();

    const form = event.target;
    const site = window.location.host;
    const search = form.elements.q.value;
    const query = `site:${site} ${search}`;

    const searchParams = new URLSearchParams();
    searchParams.append("q", query);

    const searchUrl = `${form.action}?${searchParams}`;
    window.open(searchUrl, "_blank");
  }

  return (
    <form
      className={"d-flex align-items-stretch mb-4 mb-md-0 " + className}
      role="search"
      action="https://www.google.com/search"
      onSubmit={handleSubmit}>
      <div className="input-group border-white">
        <input className="form-control"  type="search" placeholder="Search" aria-label="search" name="q"/>
        <button className="btn btn-outline-secondary" type="submit" >
          <i className="bi bi-search" ></i>
          <span className="visually-hidden">submit</span>
        </button>
      </div>
    </form>
  );
}

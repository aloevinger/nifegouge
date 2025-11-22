function NIFEAbout() {
  return (
    <div className="page-container">
            <p className="about-text" style={{fontSize: '11px', color: '#666', textAlign: 'center', marginTop: '-18px', marginBottom: '-15px', fontStyle: 'italic'}}>
              Tip: Scroll left/right through the tabs above if your screen is too narrow to display them all
            </p>
            <h1 className="about-title">
              Welcome to <em>NIFE</em>
            </h1>

            <p className="about-text">
                This section is dedicated to NIFE training resources
            </p>

            <p className="about-text">
              Here you'll find problem generators and solvers (primarily for Navigation, plus Weather and FR&R), EPs and Limits practice/TOLD cards for flight stage,
              as well as curated gouge documents/links and high-quality practice questions, all submitted and vetted by
              students who have successfully made it through NIFE.
            </p>

            <p className="about-text">
              The NIFE project is complete for now. I've personally written about 450 questions and 15 documents. Going forward,
              any corrections or new content will be left up to the current NIFE community.
              If you spot issues or have ideas for new features, please reach out at
              pinksheetmafia@gmail.com.
            </p>

            <p className="about-text">
              The value of this resource depends on the community:
            </p>
            <ul className="about-list">
              <li>Submit questions, docs, and links you think will help future students.</li>
              <li>Edit or downvote outdated or incorrect content.</li>
              <li>
                If you're comfortable with code, contribute directly via our{' '}
                <a
                  href="https://github.com/aloevinger/nifegouge"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="about-link"
                >
                  open-source GitHub repo
                </a>.
              </li>
            </ul>

            <p className="about-text">
              Thanks,<br/>ENS Loevinger
            </p>
          </div>
  );
}

export default NIFEAbout;
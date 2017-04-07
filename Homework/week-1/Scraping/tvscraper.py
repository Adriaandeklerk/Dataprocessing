#!/usr/bin/env python
# Name: Adriaan de Klerk
# Student number: 10323929
'''
This script scrapes IMDB and outputs a CSV file with highest rated tv series.
'''
import csv

from pattern.web import URL, DOM, plaintext

TARGET_URL = "http://www.imdb.com/search/title?num_votes=5000,&sort=user_rating,desc&start=1&title_type=tv_series"
BACKUP_HTML = 'tvseries.html'
OUTPUT_CSV = 'tvseries.csv'


def extract_tvseries(dom):
    '''
    Extract a list of highest rated TV series from DOM (of IMDB page).

    Each TV series entry should contain the following fields:
    - TV Title
    - Rating
    - Genres (comma separated if more than one)
    - Actors/actresses (comma separated if more than one)
    - Runtime (only a number!)
    '''
    url = URL(TARGET_URL)
    dom = DOM(url.download(cached=True))

    # Create a content list that stores each film
    contentlist = []

    # For loop that iterates over each film element
    for e in dom("div.lister-item-content")[:50]:

        # Create a new list for each film
        film = []
        # Look up data for each variable and append the list
        title = plaintext((e.by_tag("a")[:1][0]).content).encode("utf-8")
        film.append(title)
        rating = plaintext((e.by_tag("strong")[:1][0]).content).encode("utf-8")
        film.append(rating)
        genre = plaintext((e.by_class("genre")[:1][0]).content).encode("utf-8")
        film.append(genre)

        # For actors use a for loop to iterate over content
        for rows in e.by_tag("p"):
            # If 'Stars:' is in content, the names are behind it
            if "Stars" in rows.content:
                actors = plaintext((rows.by_tag("a")[0]).content).encode("utf-8")
                film.append(actors)

        # Store runtime and strip away the addition of 'min'
        runtime = plaintext((e.by_class("runtime")[:1][0]).content).encode("utf-8").strip(' min')
        film.append(runtime)

        # Add each film list to the content list that the function returns
        contentlist.append(film)
        
    return contentlist


def save_csv(f, tvseries):
    '''
    Output a CSV file containing highest rated TV-series.
    '''
    writer = csv.writer(f)

    # Create the column names
    writer.writerow(['Title', 'Rating', 'Genre', 'Actors', 'Runtime'])

    # Write each row with the data from the tvseries list
    writer.writerows(tvseries)


if __name__ == '__main__':
    # Download the HTML file
    url = URL(TARGET_URL)
    html = url.download()

    # Save a copy to disk in the current directory, this serves as an backup
    # of the original HTML, will be used in grading.
    with open(BACKUP_HTML, 'wb') as f:
        f.write(html)

    # Parse the HTML file into a DOM representation
    dom = DOM(html)

    # Extract the tv series (using the function you implemented)
    tvseries = extract_tvseries(dom)

    # Write the CSV file to disk (including a header)
    with open(OUTPUT_CSV, 'wb') as output_file:
        save_csv(output_file, tvseries)

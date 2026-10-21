import json

def pub_tags(data):
    tags = []
    for t in data.get('tags', []):
        tags.append(f"""<span class="tag">{t}</span>""")
    tags = '\n'.join(tags)
    return tags

def pub_authors(data):
    authors = []
    for auth in data['authors']:
        if 'kamienski' in auth.lower():
            auth = f"<b>{auth}</b>"
        authors.append(f"""<span class="author">{auth}</span>""")
    authors = ', '.join(authors)
    return authors

def info_button(data, name, label):
    btn = ""
    if name in data:
        pub_id = data['id']
        btn = f"""<div class="button {name}-btn info-button" onclick="toggleInfo('{pub_id}', '{name}');">{label}</div>"""
    return btn

def url_button(name, url):
    return f"""<div class="button" onclick="window.open('{url}', '_blank')">{name}</div>"""

def pub_resources(data):
    buttons = []
    for name, url in data.get('resources', {}).items():
        buttons.append(url_button(name, url))
    buttons = '\n'.join(buttons)
    return buttons

def pub_buttons(data):
    abstract = info_button(data, 'abstract', 'Abstract')
    bibtex = info_button(data, 'bibtex', 'BibTeX')
    resources = pub_resources(data)
    
    return '\n'.join([abstract, bibtex, resources])

def make_bibtex(data):
    bibtex = ""
    if 'bibtex' in data:
        bib_type = data['bibtex']['type']
        bib_id = data['bibtex']['id']
        
        values = []
        for key, value in data['bibtex'].items():
            if key not in ['type', 'id']:
                values.append(f"  {key}={{{value}}}")
        values = ',\n'.join(values)
        bibtex = f"""@{bib_type}{{{bib_id},\n{values}\n}}"""
    return bibtex
        
def make_publication(pub_data, item_indexes):
    pub_id = pub_data['id']
    index = item_indexes[pub_id]
    img_url = pub_data['image']
    title =  pub_data['title']
    tags = pub_tags(pub_data)
    authors = pub_authors(pub_data)
    venue = pub_data.get('venue', '')
    descr = pub_data.get('description', '')
    year = pub_data['year']
    buttons = pub_buttons(pub_data)
    abstract = pub_data.get('abstract', "")
    bibtex = make_bibtex(pub_data)
    
    return f"""
    <div class="item" id="{pub_id}">
      <span class="anchor" id="{pub_id}-anchor"></span>
      <div class="summary">
        <div class="image">
          <img src="{img_url}">
        </div>
        <div class="information">
          <div class="item-title">
            {index}. {title}
          </div>
          <div class="item-tags">
            {tags}
          </div>
          <div class="paper-info">
            <div class="authors-venue">
              <div class="authors">
                {authors}
              </div>
              <div class="paper-description">
                {descr}
              </div>
              <div class="venue">
                {venue}
              </div>
            </div>
            <div class="year">
              {year}
            </div>
          </div>
          <div class="button-container">\n{buttons}
          </div>
        </div>
      </div>
      <div class="add-info">
        <pre class="abstract">{abstract}</pre>
        <pre class="bibtex">{bibtex}</pre>
      </div>
    </div>"""

def proj_info_item(key, val):
    return f"""
    <div class="info-item">
      <div class="info-label">{key}:</div>
      <div class="info-description">{val}</div>
    </div>"""

def references_list(data, key, item_indexes):
    pub_list = []
    
    ordered = sorted(data[key], key=lambda p: item_indexes[p])
    
    for p in ordered:
        p_index = item_indexes[p]
        text = f"""<a href="javascript:moveTo('{p}');">{p_index}</a>"""
        pub_list.append(text)
    
    pub_list = ', '.join(pub_list)
    
    return proj_info_item(key, pub_list)

def make_info_table(data, item_indexes):
    items = []
    for k, v in data['info'].items():
        if k not in ['Other work', 'Publications']:
            items.append(proj_info_item(k, v))
    
    if 'Publications' in data['info']:
        items.append(references_list(data['info'], 'Publications', item_indexes))
    if 'Other work' in data['info']:
        items.append(references_list(data['info'], 'Other work', item_indexes))
        
    items = '\n'.join(items)
    return items

def make_project(data, item_indexes):
    proj_id = data['id']
    title = data['title']
    description = data['description']
    image = data['image']
    info_table = make_info_table(data, item_indexes)
    
    return f"""
    <div class="item" id="{proj_id}">
      <div class="summary">
        <div class="image">
          <img src="{image}">
        </div>
        <div class="information">
          <div class="item-title">{title}</div>
          <div class="description">{description}</div>
          <div class="button-container">
            <div class="button more-info-btn info-button" onclick="toggleInfo('{proj_id}', 'more-info');">
              More information
            </div>
          </div>
        </div>
      </div>
      <div class="add-info">
        <div class="info-table more-info">\n{info_table}
        </div>
      </div>
    </div>"""

def get_item_indexes(data):
    item_indexes = {}
    for l in data:
        if l['type'] == 'publications':
            for s in l['lists']:
                list_items = sorted(s['items'], key=lambda i: str(i['post-date']))
                list_items = {p['id']: i for i, p in enumerate(list_items, start=1)}
                item_indexes |= list_items
    return item_indexes

def list_template(list_id, list_name, content):
    return f"""
    <div id="{list_id}-expand-button" class="collapse-button" onclick="expand('{list_id}');">
      <h1 class="list-title">{list_name}</h1>
      <div id="{list_id}-icon" class="collapse-icon">&#x02795;</div> 
    </div>
    <div class="collapsible" id="{list_id}">{content}
    </div>"""

def make_list(data, item_indexes):
    list_id = data['id']
    list_type = data['type']
    list_name = data['name']
    
    sublists = []
    for  l in data['lists']:
        sublists.append(make_sublist(l, list_type, item_indexes))
    sublists = '\n'.join(sublists)
    
    return list_template(list_id, list_name, sublists)

def sublist_template(name, items):
    return f"""
    <h2>{name}</h2>
    <div class="list">{items}
    </div>"""

def make_sublist(data, list_type, item_indexes):
    sublist_name = data.get('name', '')
    items = []
    
    for i in data['items']:
        if list_type == 'publications':
            items.append(make_publication(i, item_indexes))
        elif list_type == 'projects':
            items.append(make_project(i, item_indexes))
            
    items = '\n'.join(items)
    
    return sublist_template(sublist_name, items)

def main():
    with open('data.json', 'r') as f:
        data = json.loads(f.read())

    item_indexes = get_item_indexes(data)

    parts = [make_list(l, item_indexes) for l in data]

    html = '<hr>\n'.join(parts)

    with open('index.html', 'w') as f:
        f.write(html)

if __name__ == '__main__':
    main()

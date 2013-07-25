from setuptools import setup

setup(name='Dictionary',
      version='1.0',
      description='Oxford dictionary clone',
      author='Maralla',
      author_email='maralla.ai@gmail.com',
      url='http://t-maralla.rhcloud.com/',
      install_requires=['Flask>=0.7.2', 'mongokit', 'lxml'],
     )

import './Cooking.scss';
import React, { FC, useCallback, useState, useEffect, useRef, useMemo } from 'react';
import { parseJSON } from 'date-fns';
import { nanoid } from 'nanoid';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import Tooltip from 'react-bootstrap/Tooltip';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';

import Recipe from './Recipe';

import { useSelector, useDispatch, actions } from '../store';
import { Recipe as RecipeType } from '../types';
import useQuery from '../hooks/useQuery';
import useAWS from '../hooks/useAWS';

const apiURL =
  process.env.NODE_ENV === 'development'
    ? process.env.REACT_APP_API_URL_DEV
    : process.env.REACT_APP_API_URL_PROD;

const Cooking: FC = () => {
  const dispatch = useDispatch();
  const saveOnChange = useRef(false);
  const editIncomingRecipe = useRef('');
  const { query, setQuery } = useQuery();
  const { recipes, user } = useSelector((state) => state);
  const { loading, upload, saveRecipes, loadRecipes } = useAWS();
  const [editId, setEditId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const sorting = query.sort || 'created';
  const sortDirection = query.direction || 'desc';
  const sortedRecipes = useRef<RecipeType[]>([]);
  const onlyMyRecipes = query.show === 'my-recipes';

  // When signed in, load recipes created by the user
  useEffect(() => {
    if (user) loadRecipes();
  }, [user, loadRecipes]);

  // When saveOnChange is true and recipes change, save them
  useEffect(() => {
    if (!saveOnChange.current) return;

    saveRecipes();

    saveOnChange.current = false;
  }, [recipes, saveOnChange, saveRecipes]);

  // When editIncomingRecipe is an id and recipes change make it editable
  useEffect(() => {
    if (!editIncomingRecipe.current) return;

    setEditId(editIncomingRecipe.current);

    editIncomingRecipe.current = '';
  }, [recipes, editIncomingRecipe]);

  // Upload an image selected by the user and save it
  const uploadFile = useCallback(
    (file: File, id: string) => {
      upload(file.name).then(async ({ error, response }) => {
        if (error || !response) return;

        // Create a form to POST to AWS
        const form = new FormData();

        // Add all fields required for the pre-signed URL upload to succeed
        Object.keys(response.upload.fields).map((key) => {
          return form.append(key, response.upload.fields[key]);
        });

        // Add the image
        form.append('file', file);

        // Send the request straight to AWS
        await fetch(response.upload.url, {
          method: 'POST',
          mode: 'no-cors',
          body: form
        });

        // This enables the useEffect hook that saves the recipes
        // The hook will only trigger after the updateRecipes action has updated the store
        saveOnChange.current = true;

        // Update the store
        dispatch(
          actions.updateRecipe({
            image: response.link,
            id
          })
        );
      });
    },
    [upload, dispatch]
  );

  const deleteRecipe = useCallback(
    (id) => {
      // Make a shallow copy of the recipes
      const newList = recipes.slice();

      // Find index of deleted recipe
      const index = newList.findIndex((recipe) => recipe.id === id);

      // Remove the recipe based on its index
      newList.splice(index, 1);

      // This enables the useEffect hook that saves the recipes
      // The hook will only trigger after the set action has updated the store
      saveOnChange.current = true;

      // Update the store
      dispatch(
        actions.set({
          recipes: newList
        })
      );

      // Hide the delete recipe modal
      setDeleteId(null);

      // Turn off recipe Edit mode
      setEditId(null);
    },
    [recipes, dispatch]
  );

  // Sort recipes whenever the list or sorting states update
  sortedRecipes.current = useMemo(() => {
    // While editing a recipe, only update the recipe being edited
    if (editId !== null) {
      const index = sortedRecipes.current.findIndex((recipe) => recipe.id === editId);

      const recipe = recipes.find((recipe) => recipe.id === editId);

      if (!recipe) return sortedRecipes.current;

      sortedRecipes.current[index] = recipe;

      return sortedRecipes.current;
    }

    return recipes.slice().sort((a, b) => {
      const direction = sortDirection === 'asc' ? 1 : -1;

      if (sorting === 'name') {
        return a.name.toLowerCase() > b.name.toLowerCase() ? direction : -1 * direction;
      }

      if (sorting === 'difficulty') {
        return (a.difficulty - b.difficulty) * direction;
      }

      return (parseJSON(a.created).valueOf() - parseJSON(b.created).valueOf()) * direction;
    });
  }, [recipes, sorting, editId, sortDirection, sortedRecipes]);

  return (
    <div className="Cooking">
      <div className="sub-menu">
        <h1>Cooking Recipes {loading && <Spinner animation="border" />}</h1>
        {user ? (
          <>
            <OverlayTrigger
              show={editId ? false : undefined}
              placement="left"
              overlay={
                <Tooltip id="create-tooltip">Recipes you create are only visible to you</Tooltip>
              }
            >
              <Button
                variant="success"
                disabled={editId !== null}
                onClick={() => {
                  const id = nanoid();

                  dispatch(actions.addRecipe({ id }));

                  editIncomingRecipe.current = id;
                }}
              >
                <i className="fas fa-plus" /> Create
              </Button>
            </OverlayTrigger>
          </>
        ) : (
          <>
            Add your own recipes{' '}
            <a className="btn btn-success" href={`${apiURL}/signin`} rel="noreferrer">
              <i className="fas fa-sign-in-alt" /> Sign in
            </a>
          </>
        )}
      </div>
      <div className="filters">
        {user && (
          <Form.Group controlId="my-recipes">
            <Form.Check
              disabled={editId !== null}
              checked={onlyMyRecipes}
              onChange={(e) => {
                setQuery({ show: e.target.checked ? 'my-recipes' : '' });
              }}
              type="checkbox"
              label={<small>Only show my recipes</small>}
            />
          </Form.Group>
        )}
        <small>Sorting:</small>
        {['created', 'difficulty', 'name'].map((prop) => (
          <Button
            disabled={editId !== null}
            className={sorting === prop ? 'active' : ''}
            onClick={() => {
              if (sorting === prop) {
                setQuery({ direction: sortDirection === 'asc' ? 'desc' : 'asc' });
              } else {
                setQuery({ sort: prop });
              }
            }}
            key={prop}
            size="sm"
            variant="outline-primary"
          >
            {prop}{' '}
            {sorting === prop && (
              <>
                {sortDirection === 'asc' ? (
                  <span>
                    <i className="fas fa-chevron-up" />
                  </span>
                ) : (
                  <b>
                    <i className="fas fa-chevron-down" />
                  </b>
                )}
              </>
            )}
          </Button>
        ))}
      </div>
      <div className="recipes">
        {sortedRecipes.current.map(
          (recipe, index) =>
            (!onlyMyRecipes || recipe.creator === user?.email) && (
              <Recipe
                key={index}
                index={index}
                recipe={recipe}
                editId={editId}
                setEditId={setEditId}
                setDeleteId={setDeleteId}
                uploadFile={uploadFile}
              />
            )
        )}
      </div>
      <Modal
        animation={false}
        className="modal"
        show={deleteId !== null}
        onHide={() => {
          setDeleteId(null);
        }}
      >
        <Modal.Header closeButton>Are you sure?</Modal.Header>
        <Modal.Footer>
          <Button
            variant="dark"
            onClick={() => {
              setDeleteId(null);
            }}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              deleteRecipe(deleteId);
            }}
          >
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Cooking;
